function notFound (req, res) {
    res.status(404).json({error:"404 not found"})
}

module.exports = notFound