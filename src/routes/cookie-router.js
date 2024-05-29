import { Router } from 'express';
export const router=Router();


router.get("/setcookies", (req, res)=>{
   let datos = {nombre : "juan"}
   let datos2 = {nombre : "jorge"}

   res.cookie("cookie1", "valor de la cookie 1", {})
   res.cookie("tiempo", datos, {expires: new Date(2024,12,29)  })
   res.cookie("cookieConVencimiento", datos2, { maxAge : 2000 })
   res.cookie("cookieConVencimientoConFirma", datos2, {signed:true})



   res.setHeader('Content-Type', 'text/plain');
   res.status(200).send("Todo Oksss"); 
    
    
});

router.get('/getcookies', (req,res)=>{
   let cookies = req.cookies;
   let cookiesFirmadas = req.signedCookies;

   let accedoACookie = cookies.tiempo

   res.setHeader('Content-Type', 'application/json');
   res.status(200).json({cookies, accedoACookie, cookiesFirmadas}); 
})
router.get('/deletecookies', (req,res)=>{
   res.clearCookie("cookie1")
   //Object.keys(req.cookies).forEach(cookie => res.clearCookie(cookie))//BORRO TODAS LAS COOKIES
   //Object.keys(req.signedCookies).forEach(cookie => res.clearCookie(cookie))//BORRO TODAS LAS COOKIES CON FIRMA

   res.setHeader('Content-Type', 'text/plain');
   res.status(200).send("Todo Oksss"); 
    
})