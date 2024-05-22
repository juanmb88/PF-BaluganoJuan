import { Router } from 'express';
import passport from 'passport';

export const router=Router()

//RUTA ERROR
router.get("/error", (req, res)=>{
    res.setHeader('Content-Type','application/json');
    return res.status(500).json(
        {
            error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
            detalle:`Fallo al autenticar...!!!`
        }
    )
    
});

router.post('/register', passport.authenticate('register', { failureRedirect:"api/sessions/error" }), async (req,res) => {
    
    res.setHeader('Content-Type','application/json');
    return res.status(201).json({payload:"REGISTRO OK", nuevoUsuario:req.user})    
});

router.post("/login", passport.authenticate("login", {failureRedirect:"/api/sessions/error"}) , async(req, res)=>{
    let { web }=req.body;
    let usuario = {...req.user};
    console.log(req.user)
        delete usuario.password;// aca evito que quede guardo el password del user
        req.session.usuario = usuario;
        
     if(web){
        res.redirect("/")
    }else{
        res.setHeader('Content-Type','application/json');
        return res.status(200).json({payload:"Login correcto", usuario});
    } 

});

//RUTA de peticion a github
router.get("/github", passport.authenticate("github", {}), async()=>{
});

//RUTA de peticion a github (response)
router.get("/devolucionGithub", passport.authenticate("github", {failureRedirect:"/api/sessions/error"}), async(req, res)=>{
    req.session.usuario = req.user
    return res.redirect('/');
 /*    res.setHeader('Content-Type','application/json');
    return res.status(200).json({payload:req.user}); */
});

//RUTA DE LOGOUT PARA DESTRUIR UNA SESSION
router.get("/logout", (req, res) => {
    req.session.destroy(error => {
        if (error) {
            console.error(error);
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({
                error: 'Error inesperado en el servidor - Intente más tarde, o contacte a su administrador',
                detalle: error.message
            });
        }
       res.redirect('/login');
    });
});

