import { describe, it, expect } from 'vitest';
import { isSafeUrl } from './isSafeUrl';

// Some private-IP examples
const privateIPv4   = 'https://10.0.5.2';
const privateIPv4b  = 'https://172.20.10.4';
const privateIPv6   = 'https://[::1]';

describe('isSafeUrl()', () => {
  it('accepts a basic https URL', () => {
    expect(isSafeUrl('https://example.com')).toBe(true)
  })

  it('rejects non-https protocols', () => {
    expect(isSafeUrl('http://example.com')).toBe(false)
    expect(isSafeUrl('ftp://example.com')).toBe(false)
  })

  it('rejects URLs with credentials', () => {
    expect(isSafeUrl('https://user:pass@example.com')).toBe(false)
  })

  it('rejects non-443 ports', () => {
    expect(isSafeUrl('https://example.com:8443')).toBe(false)
    expect(isSafeUrl('https://example.com:443')).toBe(true)
  })

  it('rejects excessively long URLs', () => {
    const long = 'https://' + 'a'.repeat(2050) + '.com'
    expect(isSafeUrl(long)).toBe(false)
  })

  it('rejects private IPv4 addresses', () => {
    expect(isSafeUrl(privateIPv4)).toBe(false)
    expect(isSafeUrl(privateIPv4b)).toBe(false)
  })

  it('rejects private IPv6 addresses', () => {
    expect(isSafeUrl(privateIPv6)).toBe(false)
  })

  it('rejects localhost and 0.0.0.0', () => {
    expect(isSafeUrl('https://localhost')).toBe(false)
    expect(isSafeUrl('https://0.0.0.0')).toBe(false)
  })

  it('rejects mixed-case or trailing-dot hosts', () => {
    expect(isSafeUrl('https://ExAmPlE.com')).toBe(false)
    expect(isSafeUrl('https://example.com.')).toBe(false)
  })

  it('handles punycode (IDN) correctly', () => {
    // user-provided domain in Unicode
    const unicode = 'https://☕️.example'
    // URL() converts to punycode under the hood
    expect(isSafeUrl(unicode)).toBe(true)
  })
})
