import CryptoJS from 'crypto-js'

export function EncryptAES(text:any, key:any) {
    return CryptoJS.AES.encrypt(JSON.stringify(text), key).toString()
}

export function DecryptAES (encryptedBase64:any, key:any)  {
    const decrypted = CryptoJS.AES.decrypt(encryptedBase64, key)
    

        try 
        {
            const str = CryptoJS.enc.Utf8.stringify(decrypted);

            if( Object.keys(str).length > 0) 
            {
                return str;
            } 
            else {
                return 'error 1'
            } 
        } 
        catch (e) 
        {
            return 'error 2'
        }
}