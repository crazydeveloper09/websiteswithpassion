

const express = require("express"),
    Category = require("../models/category"),
    Project = require("../models/project");
    app = express(),
    methodOverride = require("method-override"),
    i18n = require("i18n"),
    flash = require("connect-flash"),
    router = express.Router();


app.use(flash());
app.use(methodOverride("_method"));

router.get("/add", isLoggedIn, (req, res) => {
    let header = "Dodaj kategorię | Projekty | Websites With Passion";
    res.render("./category/new", {
        header: header, 
        currentUser: req.user
    })
})

router.post("/", isLoggedIn, (req, res) => {
    let newCategory = new Category({
        title: req.body.title, 
        titleEn: req.body.titleEn,
        color: req.body.color
        
    })
    Category.create(newCategory, (err, createdCategory) => {
        if(err){
            console.log(err);
        } else {
			createdCategory.link = req.body.titleEn.toLowerCase().split(' ').join('-');
			createdCategory.save();
            res.redirect("/projects");
        }
    })
})

router.get("/:id/edit", isLoggedIn, (req, res) => {
    Category.findOne({link:req.params.id}, (err, category) => {
        if(err){
            console.log(err);
        } else {
            let header = `Edytuj kategorię ${category.title} | Websites With Passion`;
            res.render("./category/edit", {
                category:category,
                header: header, 
                currentUser: req.user
            })
        }
    })
    
})

router.put("/:id", isLoggedIn, (req, res) => {
    Category.findByIdAndUpdate(req.params.id, req.body.category, (err, updatedCategory) => {
        if(err){
            console.log(err);
        } else {
			
			updatedCategory.link = updatedCategory.titleEn.toLowerCase().split(' ').join('-');
            updatedCategory.save();
			
            
            res.redirect(`/projects/category/${updatedCategory.link}`)
        }
    })
})

router.get("/:id/delete", isLoggedIn, (req, res) => {
    Category.findByIdAndRemove(req.params.id, (err, updatedCategory) => {
        if(err){
            console.log(err);
        } else {
            res.redirect(`/projects`)
        }
    })
})

router.get("/:id", (req, res) => {
    Category.findOne({link: req.params.id}).populate("projects").exec((err, category) => {
        if(err){
            console.log(err);
        } else {
            Category.find({}, (err,otherCategories) => {
                if(err){
                    console.log(err)
                } else {
					
                    i18n.setLocale(req.language);
                    let header = `${category.titleEn} | Projekty | Websites With Passion`
                    res.render("./category/show", {
                        otherCategories:otherCategories,
                        category:category,
                        header: header, 
                        currentUser: req.user, 
                        my:""})
                }
            })
           
        }
    })
   
})

router.get("/:category_id/addP", isLoggedIn, (req, res) => {
    Project.find({categories: {$ne: req.params.category_id}}, (err,projects) => {
        if(err){
            console.log(err)
        } else {
            Category.findById(req.params.category_id, (err, category) => {
                if(err){
                    console.log(err);
                } else {
                    let header = `Dodaj projekt do kategorii ${category.title} | Websites With Passion`
                    res.render("./category/addP", {
                        category:category,
                        projects: projects,
                        header: header, 
                        currentUser: req.user, 
                        recommended:""
                    })
                }
            })
        }
    })
    
});

router.post("/:category_id/addP", isLoggedIn, (req, res) => {
   
    Project.findById(req.body.project, (err, project) => {
        if(err){
            console.log(err)
        } else {
            Category.findById(req.params.category_id, (err, category) => {
                if(err){
                    console.log(err);
                } else {
                    category.projects.push(project);
                    category.save();
                    project.categories.push(category);
                    project.save();
                    res.redirect(`/projects/category/${category.link}`)
                }
            })
            
        }
    })
})


function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", i18n.__("Nie masz dostępu do tej strony"));
    res.redirect(`/?return_route=${req._parsedOriginalUrl.path}`);
}


module.exports = router