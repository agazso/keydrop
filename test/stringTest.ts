import { hexToString } from '../src/string';

it('should convert with prefix', () => {
    const input = '0x7b7d';
    const result = hexToString(input);
    expect(result).toEqual('{}');
});

it('should convert without prefix', () => {
    const input = '7b7d';
    const result = hexToString(input);
    expect(result).toEqual('{}');
});

it('should convert with real data', () => {
    const input = '0x7b2274797065223a2270696e67222c227075626c69634b6579223a22307830343162303237363233326463306666323439393964613233663236376135656636616236653061613431313861666133656133383831636562303166363437383166626237613832313162633061323164356333303937366335306265353533366334363138383462323465383362356164363632613866616661333161653834227d';
    const expected = '{\"type\":\"ping\",\"publicKey\":\"0x041b0276232dc0ff24999da23f267a5ef6ab6e0aa4118afa3ea3881ceb01f64781fbb7a8211bc0a21d5c30976c50be5536c461884b24e83b5ad662a8fafa31ae84\"}';
    const result = hexToString(input);
    expect(result).toEqual(expected);
});
