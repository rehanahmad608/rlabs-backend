import type { NextApiRequest, NextApiResponse } from 'next';
import NextCors from 'nextjs-cors';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await NextCors(req, res, {
    methods: ['POST'],
    origin: [
      'http://localhost:3000',
      'https://www.reminiscelabs.com',
      'https://reminiscelabs.com',
      'https://reminiscelabs-web.vercel.app',
    ],
    optionsSuccessStatus: 200,
  });
  if (req.method === 'POST') {
    if (!req.body.email || !req.body.subject || !req.body.text || !req.body.name)
      return res.status(400).send('Missing fields');
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp-relay.sendinblue.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      await transporter.sendMail({
        from: {
          name: req.body.name,
          address: req.body.email,
        },
        to: process.env.EMAIL_USER,
        subject: req.body.subject,
        text: req.body.text,
      });
      res.send('Email sent');
    } catch (error) {
      res.status(500).send(error);
    }
  }
}
