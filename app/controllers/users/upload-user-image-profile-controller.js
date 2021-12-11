'use strict';

const createJsonError = require("../../errors/create-json-error");
const throwJsonError = require("../../errors/throw-json-error");
const randomstring = require('randomstring');
const path = require('path');
const fs = require('fs');
const { findUserProfileImage, uploadUserProfileImage } = require("../../repositories/users-repository");

const validExtensions = ['.jpeg', '.jpg', '.png'];

async function uploadImageProfile(req, res){
    try {
        const { idUser } = req.auth;
        const { files } = req;

        if(!files || Object.keys(files).length === 0){
            throwJsonError(400, 'No se ha selecionado ningún fichero');
        }
        const { profileImage } = files;
        const extension = path.extname(profileImage.name);

        if(!validExtensions.includes(extension)){
            throwJsonError(400, 'Formato no valido');
        }

        const { HTTP_SERVER, PATH_USER_IMAGE } = process.env;
        const user = await findUserProfileImage(idUser);
        const pathProfileImageFolder = `${__dirname}/../../../public/${PATH_USER_IMAGE}`;
        
        if (user.image) {
            await fs.unlink(`${pathProfileImageFolder}/${user.image}`, () => {
              console.log('Borrada imagen de perfil correctamente');
            });
        }
        
        const random = randomstring.generate(10);

        const imageName = `${idUser}-${random}${extension}`;
        const pathImage = `${pathProfileImageFolder}/${imageName}`;

        profileImage.mv(pathImage, async function(err){
            if(err) return res.status(500).send(err);
            await uploadUserProfileImage(idUser, imageName);

            res.send({url: `${HTTP_SERVER}/${PATH_USER_IMAGE}/${imageName}`});
        });

    } catch (error) {
        createJsonError(error, res);
    }
}

module.exports = uploadImageProfile;