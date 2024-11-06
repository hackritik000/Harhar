export function generateOtp(){
    return Math.floor((10 ** 6) + Math.random() * 9 * (10 ** 6)).toString()
}