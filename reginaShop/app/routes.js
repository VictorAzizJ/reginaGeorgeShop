const fetch = require("node-fetch")
const { ObjectId } = require("mongodb");

module.exports = function(app, passport, db) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    app.get('/jewelery', async (req, res) => {
      const storeResult = await fetch("https://fakestoreapi.com/products") 
      const storeJson = await storeResult.json()
      const cartResult = await db.collection('cart').find().toArray()
      
      res.render('jewelery.ejs', { inventory: storeJson, miniCart: cartResult })
  })
  
  app.get('/electronics', async (req, res) => {
      const storeResult = await fetch("https://fakestoreapi.com/products") 
      const storeJson = await storeResult.json()
      
      const cartResult = await db.collection('cart').find().toArray()
      


      
      res.render('electronics.ejs', { inventory: storeJson, miniCart: cartResult })
  })
 
  app.get('/women', async (req, res) => {
      const storeResult = await fetch("https://fakestoreapi.com/products") 
      const storeJson = await storeResult.json()
      
      const cartResult = await db.collection('cart').find().toArray()
      
      res.render('womens.ejs', { inventory: storeJson, miniCart: cartResult })
  })

  
  app.get('/men', async (req, res) => {
      const storeResult = await fetch("https://fakestoreapi.com/products") 
      const storeJson = await storeResult.json()
     
      const cartResult = await db.collection('cart').find().toArray()
      
      res.render('mens.ejs', { inventory: storeJson, miniCart: cartResult })
  })

  // PROFILE SECTION =========================
  // LOGOUT ==============================
  app.get('/logout', function (req, res) {
      req.logout(() => {
          console.log('User has logged out!')
      });
      res.redirect('/');
  });
  // message board routes ===============================================================
  //________Cart features start___________________________
  app.get('/cart', async (req, res) => {

      const cartResult = await db.collection('cart').find().toArray()
      console.log(cartResult);

      res.render('cart.ejs', { cart: cartResult })
  })

  app.post('/cartAdd', (req, res) => {
      
      console.log("this is req.body.item: ", req.body.item);
      console.log("this is req.body.itemID: ", req.body.itemID);


      db.collection('cart').insertOne({ item: req.body.item, id: req.body.itemID, inCart: true }, (err, result) => { //mini cart feature seems to have broken app during final strech. 
          if (err) return console.log(err)
          console.log('added to cart!')
          res.redirect('back');// need to reload whatever page you are currently on
          
      })
  })

  app.delete('/cartRemove', (req, res) => {
      console.log(req.body);
      console.log("server side item delete", req.body.item);
      //need to use object id here
      db.collection('cart').findOneAndDelete({ item: req.body.item }, (err, result) => {
          if (err) return res.send(500, err)
          res.send('item deleted from cart!')
      })
  })
  app.get('/checkout', async (req, res) => {
      //see if i can calculate total price of all items here if theres time.
      const cartResult = await db.collection('cart').find().toArray()
      res.render('checkout.ejs', { cart: cartResult })
  })
  //________Cart features end___________________________
  //https://jsonplaceholder.typicode.com/todos/     //testing api
  //Mark helped me with turning this into an async call
  //useing async await
  app.get('/inventory', async (req, res) => {
      const storeResult = await fetch("https://fakestoreapi.com/products") //later on put grocery api here
      const storeJson = await storeResult.json()
      // console.log(storeJson);
      //const result = await db.collection('cart').find().toArray() //can use this logic structure later to loop through grocery items and try to find them in the cart, then do stuff based on that
      res.render('inventory.ejs', { inventory: storeJson })
  })
// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/jewelery', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/jewelery', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}






/*const fetch = require("node-fetch");
const { ObjectId } = require("mongodb");
module.exports = function (app, passport, db) {
    
    app.get('/', function (req, res) {
        res.render('index.ejs');
    });
    
    app.get('/jewelery', async (req, res) => {
        const storeResult = await fetch("https://fakestoreapi.com/products") 
        
        const cartResult = await db.collection('cart').find().toArray()
        
        res.render('jewelery.ejs', { inventory: storeJson, miniCart: cartResult })
    })
    
    app.get('/electronics', async (req, res) => {
        const storeResult = await fetch("https://fakestoreapi.com/products") 
        const storeJson = await storeResult.json()
        
        const cartResult = await db.collection('cart').find().toArray()
        


        
        res.render('electronics.ejs', { inventory: storeJson, miniCart: cartResult })
    })
   
    app.get('/women', async (req, res) => {
        const storeResult = await fetch("https://fakestoreapi.com/products") 
        const storeJson = await storeResult.json()
        
        const cartResult = await db.collection('cart').find().toArray()
        
        res.render('womens.ejs', { inventory: storeJson, miniCart: cartResult })
    })

    
    app.get('/men', async (req, res) => {
        const storeResult = await fetch("https://fakestoreapi.com/products") 
        const storeJson = await storeResult.json()
       
        const cartResult = await db.collection('cart').find().toArray()
        
        res.render('mens.ejs', { inventory: storeJson, miniCart: cartResult })
    })

    // PROFILE SECTION =========================
    // LOGOUT ==============================
    app.get('/logout', function (req, res) {
        req.logout(() => {
            console.log('User has logged out!')
        });
        res.redirect('/');
    });
    // message board routes ===============================================================
    //________Cart features start___________________________
    app.get('/cart', async (req, res) => {

        const cartResult = await db.collection('cart').find().toArray()
        console.log(cartResult);

        res.render('cart.ejs', { cart: cartResult })
    })

    app.post('/cartAdd', (req, res) => {
        
        console.log("this is req.body.item: ", req.body.item);
        console.log("this is req.body.itemID: ", req.body.itemID);


        db.collection('cart').insertOne({ item: req.body.item, id: req.body.itemID, inCart: true }, (err, result) => { //mini cart feature seems to have broken app during final strech. 
            if (err) return console.log(err)
            console.log('added to cart!')
            res.redirect('back');// need to reload whatever page you are currently on
            
        })
    })

    app.delete('/cartRemove', (req, res) => {
        console.log(req.body);
        console.log("server side item delete", req.body.item);
        //need to use object id here
        db.collection('cart').findOneAndDelete({ item: req.body.item }, (err, result) => {
            if (err) return res.send(500, err)
            res.send('item deleted from cart!')
        })
    })
    app.get('/checkout', async (req, res) => {
        //see if i can calculate total price of all items here if theres time.
        const cartResult = await db.collection('cart').find().toArray()
        res.render('checkout.ejs', { cart: cartResult })
    })
    //________Cart features end___________________________
    //https://jsonplaceholder.typicode.com/todos/     //testing api
    //Mark helped me with turning this into an async call
    //useing async await
    app.get('/inventory', async (req, res) => {
        const storeResult = await fetch("https://fakestoreapi.com/products") //later on put grocery api here
        const storeJson = await storeResult.json()
        // console.log(storeJson);
        //const result = await db.collection('cart').find().toArray() //can use this logic structure later to loop through grocery items and try to find them in the cart, then do stuff based on that
        res.render('inventory.ejs', { inventory: storeJson })
    })
    
   */