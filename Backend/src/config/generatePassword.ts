import crypto from 'crypto';

function generatePassword(length: number = 8): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';

  const randomBytes = crypto.randomBytes(length);
  const password = randomBytes.toString('hex');

  return password
    .split('')
    .map((char) => charset[Math.floor(Math.random() * charset.length)])
    .join('');
}

export default generatePassword;