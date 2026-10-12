import { handleUpload } from '@vercel/blob/client';

const PASSWORD = process.env.ADMIN_PASSWORD || 'Mansi#Creates26';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const json = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (clientPayload !== PASSWORD) throw new Error('Not allowed');
        return { allowedContentTypes: ['image/*', 'video/*'], addRandomSuffix: true, maximumSizeInBytes: 200 * 1024 * 1024 };
      },
      onUploadCompleted: async () => {},
    });
    res.status(200).json(json);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}
