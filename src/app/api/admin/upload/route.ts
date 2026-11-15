import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Allowed MIME types for property photos
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
]);

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB per file

export async function POST(request: NextRequest) {
  // 1. Enforce Admin Authentication
  const session = getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Admin authentication required.' },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    let files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      const single = formData.get('file') as File | null;
      if (single) {
        files = [single];
      }
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided' },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const savedFiles: Array<{
      id: string;
      url: string;
      altText: string;
      isPrimary: boolean;
      order: number;
    }> = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file || typeof file.arrayBuffer !== 'function') continue;

      // 2. Strict MIME Type Validation
      if (!ALLOWED_MIME_TYPES.has(file.type)) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid file type "${file.type}". Only JPEG, PNG, WEBP, and AVIF images are permitted.`,
          },
          { status: 400 }
        );
      }

      // 3. Strict File Size Validation
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          {
            success: false,
            error: `File "${file.name}" exceeds the maximum allowed size of 5 MB.`,
          },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // 4. Secure Filename Sanitization (Prevents Directory Traversal)
      const timestamp = Date.now();
      const rawExt = path.extname(file.name).toLowerCase();
      const safeExt = ['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(rawExt)
        ? rawExt
        : '.jpg';
      const baseName = path
        .basename(file.name, rawExt)
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .slice(0, 50);

      const filename = `${timestamp}-${i}-${baseName}${safeExt}`;
      const filePath = path.join(uploadDir, filename);

      fs.writeFileSync(filePath, buffer);

      savedFiles.push({
        id: `med-${timestamp}-${i}`,
        url: `/uploads/${filename}`,
        altText: baseName.replace(/_/g, ' '),
        isPrimary: i === 0,
        order: i + 1,
      });
    }

    return NextResponse.json({
      success: true,
      files: savedFiles,
    });
  } catch (err: any) {
    console.error('Error handling secure file upload:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to process file upload' },
      { status: 500 }
    );
  }
}
