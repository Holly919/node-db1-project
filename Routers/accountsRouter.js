const express = require('express');
const db = require('../data/dbConfig');
//const dbQuery = require('../data/queries');

const router = express.Router();

router.get("/", async (req, res) => {
    try {
      const accounts = await db("accounts")
      res.status(200).json(accounts)
    } catch(error){
      res.status(500).json({message: "error retrieving accounts"})
    }
  })

  router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const accounts = await db.select('*').from('accounts').where({ id }).first();
        if (accounts) {
            res.status(200).json(accounts);
        } else {
            res.status(400).json({ message: "Account not found" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "sorry, ran into an error" });
    }
});

// router.post('/', async (req, res) => {
//     const accountsData = req.body;

//     try {
//         const post = await db.insert(accountsData).into('accounts');
//         res.status(201).json(accounts);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ message: 'db problem', error: err });
//     }


// });

router.post('/', (req, res) => {
    const accountData = req.body;
    db('accounts')
    .insert(accountData)
    .then(res.status(201).json({ data:accountData}))
    .catch(err => console.log('adding post failed'))
});


router.put('/:id', (req, res) => {
    const id = req.params.id;
    const changes = req.body;
    db('accounts')
    .where({id})
    .update(changes)
    .then(count => {
        if (count) {
            res.status(200).json({ updated: count });
        } else {
            res.status(404).json({ message: 'invalid id' });
        }
    })
    .catch(err => {
        res.status(500).json({ message: 'db problem' })
    })
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const count = await db.del().from('accounts').where({ id });
        count ? res.status(200).json({ deleted: count })
            : res.status(404).json({ message: 'invalid id' });
    } catch (err) {
        res.status(500).json({ message: 'database error', error: err });
    }


});

module.exports = router;