const cheerio = require("cheerio");
const fs = require("fs");
fs.readFile("./pages/test2.html", "utf8", (err, content) => {
  const $ = cheerio.load(content);
    function strapping(){
        let titre = $('h1').text();
        let paragraphe = $('.editor-wysiwyg').text();
        let titreH2 = [];
        $('h2').each(function(){
          titreH2.push($(this).text());
        })
        let titreH3 = [];
        $('h3').each(function(){
          titreH3.push($(this).text());
        })
        let textHeading = [];
        $('.text-heading').each(function(){
          textHeading.push($(this).text());
        })
        let photoSide =[];
        $('.cta-media-side-sheet').each(function(){
            photoSide.push($(this).attr('src'));
        })
        let photoTeam =[];
        $('.alignnone').each(function(){
            photoTeam.push($(this).attr('src'));
        })
        let infoTitre = [];
        $('.label-info').each(function(){
          infoTitre.push($(this).text());
        })
        let infoText = [];
        $('.text-info').each(function(){
          infoText.push($(this).text());
        })
        let imageHeader = [];
        $('.media-heading > img').each(function(){
          imageHeader.push($(this).attr('src'));
        })
        let infoEquipe = [];
        $('.infoPerso-info').each(function(){
          infoEquipe.push($(this).text());
        })
        let photoShow =[];
        $('.size-full').each(function(){
          photoShow.push($(this).attr('src'));
        })
        let myObj = {"titre_Level_1":titre , "titre_Level_2":titreH2 , "image_header": imageHeader , "titre_Level_3":titreH3 , "text_heading":textHeading ,
        "text_principal": paragraphe ,"photo_side" : photoSide, "photo_nom_membre": photoTeam , "photo_spectacle": photoShow ,
      "info_titre": infoTitre , "info_text": infoText , "info_equipe": infoEquipe};
        let myJson = JSON.stringify(myObj);
        console.log(myJson);
      }
        strapping();