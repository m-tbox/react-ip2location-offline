import express from 'express'
import geoip from 'geoip-lite'
const router = express.Router()

router.get('/:ip', (req, res) => {
    const ip = req.params.ip

    if (ip) {
        try {
            // Get data of geo location from library lookup method and send in response
            const data = geoip.lookup(ip);
            return res.send({ data })
        } catch (error) {
            return res.status(503).json({
                error: {
                    message: error
                }
            })
        }
    } else {
        return res.status(404).json({
            error: {
                message: 'Ip Address missing'
            }
        })
    }


})


export default router