import Imagekit from "@imagekit/nodejs"

const imageKit = new Imagekit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
})

export default imageKit