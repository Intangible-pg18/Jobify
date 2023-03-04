const express = require('express');
const mysql = require('mysql');
const pug = require('pug');


const app = express();
app.use(express.static('Frontend'));

// Create MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Edndash887.',
  database: 'job_data'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database!');
});



// Define API endpoints
app.get('/listings', (req, res) => {
    let { role, company, city, page } = req.query;
    if(page==undefined)
    page = 1;
    const jobsPerPage = 10;
    const offset = (page - 1) * jobsPerPage || 0;
  
    let sql = 'SELECT * FROM job_main_data';
  
    if (role && !company && !city) {
        sql += ` WHERE post LIKE '%${role}%'`;
      } else if (!role && company && !city) {
        sql += ` WHERE company LIKE '%${company}%'`;
      } else if (!role && !company && city) {
        sql += ` WHERE location LIKE '%${city}%'`;
      } else if (role && company && !city) {
        sql += ` WHERE post LIKE '%${role}%' AND company LIKE '%${company}%'`;
      } else if (role && !company && city) {
        sql += ` WHERE post LIKE '%${role}%' AND location LIKE '%${city}%'`;
      } else if (!role && company && city) {
        sql += ` WHERE company LIKE '%${company}%' AND location LIKE '%${city}%'`;
      } else if (role && company && city) {
        sql += ` WHERE post LIKE '%${role}%' AND company LIKE '%${company}%' AND location LIKE '%${city}%'`;
      }
    let sql2 = sql;
    sql += ` LIMIT ${jobsPerPage} OFFSET ${offset}`;
  
    db.query(sql, (err, result) => {
      if (err) {
        throw err;
      }
  
      // Generate dynamic HTML for job cards
      let jobCardsHTML = '';
      for (let i = 0; i < result.length; i++) {
        const job = result[i];
        const post = job.Post;
        const company = job.Company;
        const location = job.Location;
        const details_link = job.Details_link;
  
        jobCardsHTML += ` 
    <div class="job-card">
        <div class="job-card-header">
            <h2 class="job-card-title">${post}</h2>
                <a href="?role=&company=${company}&city="> 
                    <p class="job-card-company">${company}</p> 
                </a>
        </div>
        <a href="?role=&company=&city=${location}"> 
        <div class="job-card-location">
            <img src="/assets/images/place-marker.png" alt="Location Pin Icon" class="location-icon">
            <p class="location-name">${location}</p>
        </div>
        </a>
        <div class="job-card-details">
            <a href="${details_link}" class="details-button">Details</a>
        </div>
    </div>
        `;
      }
       
      sql2 = sql2.replace("SELECT *","SELECT COUNT(*) AS Num")
      // Get the total number of jobs
      db.query(sql2, (err, result) => {
        if (err) {
          throw err;
        } 
        const totalJobs = result[0].Num;
        const totalPages = Math.ceil(totalJobs / jobsPerPage);
    
        // Generate dynamic HTML for pagination links
        let paginationLinksHTML = ``
        if(parseInt(page)>1)
        {
            paginationLinksHTML += `
            <li class="prev-page">
              <a class="page-link" href="?role=${role || ''}&company=${company || ''}&city=${city || ''}&page=${parseInt(page)-1}"><- Prev</a>
            </li>
            `;
        } 
         
        for (let i = 1; i <= totalPages; i++) {
          paginationLinksHTML += `
            <li class="page-item${i === parseInt(page) ? ' active' : ''}">
              <a class="page-link" href="?role=${role || ''}&company=${company || ''}&city=${city || ''}&page=${i}">${i}</a>
            </li>
          `;
        }
        if(parseInt(page)< totalPages)
        {
            paginationLinksHTML += `
        <li class="next-page">
        <a class="page-link" href="?role=${role || ''}&company=${company || ''}&city=${city || ''}&page=${parseInt(page)+1}">Next -></a>
      </li>
      `;
        } 
        
    
        // Send HTML response with dynamic job cards and pagination links inserted into main section
        res.send(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
            <meta name="description" content="">
            <meta name="author" content="">
            <link rel="preconnect" href="https://fonts.gstatic.com">
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
            <title>Plot Listing HTML5 Website Template</title>
            <!-- Bootstrap core CSS -->
            <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
            <!-- Additional CSS Files -->
            <link rel="stylesheet" href="assets/css/fontawesome.css">
            <link rel="stylesheet" href="assets/css/templatemo-plot-listing.css">
            <link rel="stylesheet" href="assets/css/animated.css">
            <link rel="stylesheet" href="assets/css/owl.css">
            <style>
            <hr {width: 13px; background-color: rgb(161, 141, 215);}
            </style>
            </head>
        <body>
          <!-- ***** Preloader Start ***** -->
          <div id="js-preloader" class="js-preloader">
            <div class="preloader-inner">
              <span class="dot"></span>
              <div class="dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
          <!-- ***** Preloader End ***** -->
          <!-- ***** Header Area Start ***** -->
          <header class="header-area header-sticky wow slideInDown" data-wow-duration="0.75s" data-wow-delay="0s">
            <div class="container">
              <div class="row">
                <div class="col-12">
                  <nav class="main-nav">
                    <!-- ***** Logo Start ***** -->
                    <a href="index.html" class="logo"> <img src="assets/images/black-logos.png" alt="Plot Listing"> </a>
                    <!-- ***** Logo End ***** -->
                    <!-- ***** Menu Start ***** -->
                    <ul class="nav">
                    <li><a href="index.html" class="active">Home</a></li>
                    <li><a href="About.html">About</a></li>
                    <li><a href="contact.html">Contact Us</a></li>
                    </ul>        
                    <a class='menu-trigger'>
                        <span>Menu</span>
                    </a>
                    <!-- ***** Menu End ***** -->
                  </nav>
                </div>
              </div>
            </div>
          </header>
          <!-- ***** Header Area End ***** -->
          <div class="main-banner">
            <div class="container">
              <div class="row">
                <div class="col-lg-12">
                  <div class="top-text header-text">
                    <h6>Over 5000+ Active Listings</h6>
                    <h2>Find Your Dream Job</h2>
                  </div>
                </div>
                <div class="col-lg-12">
                  <form id="search-form" name="gs" method="GET" role="search" action="http://localhost:3001/listings">
                    <div class="row">
                      <div class="col-lg-3 align-self-center">
                          <fieldset>
                             <input type="search" name="role" class="searchText" placeholder="Job Role" autocomplete="on">
                          </fieldset>
                      </div>
                      <div class="col-lg-3 align-self-center">
                          <fieldset>
                              <input type="search" name="company" class="searchText" placeholder="Company Name" autocomplete="on">
                          </fieldset>
                      </div>
                      <div class="col-lg-3 align-self-center">
                          <fieldset>
                              <input type="search" name="city" class="searchText" placeholder="Location" autocomplete="on">
                          </fieldset>
                      </div>
                      <div class="col-lg-3">                        
                          <fieldset>
                              <button class="main-button"><i class="fa fa-search"></i> Search Now</button>
                          </fieldset>
                      </div>
                    </div>
                  </form>
                </div>
                <div class="col-lg-10 offset-lg-1">
                    <ul class="categories">
                    <li><a href="/listings?role=web&company=&city="><span class="icon"><img src="assets/images/search-icon-01.png" alt="Home"></span> Web Development</a></li>
                    <li><a href="/listings?role=app&company=&city="><span class="icon"><img src="assets/images/search-icon-02.png" alt="Food"></span> App Development</a></li>
                    <li><a href="/listings?role=machine+learning&company=&city="><span class="icon"><img src="assets/images/search-icon-03.png" alt="Vehicle"></span> ML/AI</a></li>
                    <li><a href="/listings?role=software&company=&city="><span class="icon"><img src="assets/images/search-icon-04.png" alt="Shopping"></span> Software Engineering</a></li>
                    <li><a href="/listings?role=cyber&company=&city="><span class="icon"><img src="assets/images/search-icon-05.png" alt="Travel"></span> Cyber Security</a></li>
                  </ul>
                </div>
               </div>
            </div>
          </div>
          <div class="job-card-container">
          
                <div class="job-cards">
                ${jobCardsHTML}
              </div>
          </div>
          
          <div class="pagination">
          ${paginationLinksHTML}
          </div>
              <footer>
        <div class="container">
          <div class="row">
            <div class="col-lg-4">
              <div class="about">
                <div class="logo">
                  <img src="assets/images/black-logo.png" alt="Plot Listing">
                </div>
                <p>If our website made your life a bit easier then, please support us a bit too via PayPal. Thank You</p>
              </div>
              <button type="button" class="account-login">Donate Now ></button>
            </div>
            <div class="col-lg-4">
              <div class="helpful-links">
                <h4>Helpful Links</h4>
                <div class="row">
                  <div class="col-lg-6 col-sm-6">
                    <ul>
                      <li><a href="#">Categories</a></li>
                      <li><a href="#">Reviews</a></li>
                      <li><a href="#">Listing</a></li>
                      <li><a href="#">Contact Us</a></li>
                    </ul>
                  </div>
                  <div class="col-lg-6">
                    <ul>
                      <li><a href="#">About Us</a></li>
                      <li><a href="#">Awards</a></li>
                      <li><a href="#">Useful Sites</a></li>
                      <li><a href="#">Privacy Policy</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="contact-us">
                <h4>Contact Us</h4>
                <p>Present everywhere, digitally</p>
                <div class="row">
                  <a href="mailto:iamprateek999@gmail.com">Prateek Shukla</a>
                  <a href="mailto:iamvibhor888@gmail.com">Vibhor Singh</a>
                  <a href="mailto:iamashish777@gmail.com">Ashish Soni</a>
                </div>
              </div>
            </div>
            <div class="col-lg-12">
              <div class="sub-footer">
                <p>Copyright © 2023 Jobify Co., Ltd. All Rights Reserved.
                </div>
            </div>
          </div>
        </div>
      </footer>
      <!-- Scripts -->
      <script src="vendor/jquery/jquery.min.js"></script>
      <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
      <script src="assets/js/owl-carousel.js"></script>
      <script src="assets/js/animation.js"></script>
      <script src="assets/js/imagesloaded.js"></script>
      <script src="assets/js/custom.js"></script>
    </body>
    </html>
        `);
    })
      });
    });
    
    // Start the server
    app.listen(3001, () => {
      console.log('Server started on port 3001');
    });
    