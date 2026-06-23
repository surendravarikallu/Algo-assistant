import { validateAlgorandAddress } from './walletValidator';

describe('Wallet Validator', () => {
  it('should fail on empty address', () => {
    expect(validateAlgorandAddress('').isValid).toBe(false);
  });

  it('should validate valid format address', () => {
    const dummy = 'OM54DXT6W6YXZ3JLBX53QZMXM7VSHV6G3T2F67DNY76T3GQX7C57E4R4P4';
    expect(validateAlgorandAddress(dummy).isValid).toBe(true);
  });
});
