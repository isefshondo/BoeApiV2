const express = require('express');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const multer = require('multer');
const base64 = require('base64-js');
const { Image, createCanvas } = require('canvas');
const moment = require('moment');
const { Cache } = require('./controllers/utils/Cache');
const { GenResults } = require('./controllers/utils/functions');

const app = express();
const upload = multer();

const UserSchema = new mongoose.Schema({}, { collection: 'usuarios' });
const CowSchema = new mongoose.Schema({}, { collection: 'gados' });

const User = mongoose.model('User', UserSchema);
const Cow = mongoose.model('Cow', CowSchema);

app.use(bodyParser.json());

//Rota que processa os resultados vindo da IA -> Aqui que precisa mexer pra IA
app.get('/results/:idUser/:idOx?', async (req, res) => {
  const { idUser, idOx } = req.params;

  try {
    const findUser = await User.findById(idUser).exec();
    const countOx = await Cow.countDocuments({ idPecuarista: idUser });

    if (findUser) {
      const results = GenResults.genRandomResults();
      const tempIdOx = `A${countOx + 1}`;

      const saveResults = {
        nTempIdOx: tempIdOx,
        result: results.results,
        date: moment().format('YYYY-MM-DD')
      };

      Cache.set('tempData', saveResults);

      if (!idOx) {
        await Cow.create({
          numIdentificacao: tempIdOx,
          idPecuarista: idUser
        });

        return res.status(201).json({
          nTempIdOx: tempIdOx,
          results: {
            percentage: results.results,
            phase: results.currentPhase,
            nextSymptons: results.symptonsPhase,
            level: results.level,
            details: results.details
          },
          status: 201
        });
      } else {
        const findOx = await Cow.findById(idOx).exec();

        return res.status(201).json({
          nIdOx: findOx.numIdentificacao,
          nameOx: findOx.nomeGado,
          results: {
            percentage: results.results,
            phase: results.currentPhase,
            nextSymptons: results.symptonsPhase
          },
          status: 201
        });
      }
    } else {
      return res.status(404).json({
        message: 'Não foi possível encontrar o usuário...',
        status: 404
      });
    }
  } catch (err) {
    return res.json({ message: err.message });
  }
});


//Rota para Cadastrar o Gado -> Deixar mais genérica 
app.post('/signupCow', upload.single('image'), async (req, res) => {
  const { idUser, idCow, name } = req.body;
  const image = req.file;

  const tempData = Cache.get('tempData');

  const newRecord = {
    imageAnalyzed: {
      description: 'Apresenta lesões circulares com bordar esbranquiçadas.'
    },
    results: tempData.result,
    date: tempData.date
  };

  try {
    if (!idCow && image) {
      const imgBytes = image.buffer;

      await Cow.updateOne(
        {
          idPecuarista: idUser,
          numIdentificacao: tempData.nTempIdOx
        },
        {
          $set: {
            nomeGado: name,
            fotoPerfil: imgBytes,
            status: 'Sem tratamento',
            historico: [newRecord]
          }
        }
      );
    } else {
      const findOx = await Cow.findById(idCow).exec();
      findOx.historico.push(newRecord);

      await Cow.updateOne({ _id: idCow }, { $set: { historico: findOx.historico } });
    }

    Cache.delete('tempData');
    return res.status(201).json({
      message: 'Success! Data saved successfully',
      status: 201
    });
  } catch (err) {
    return res.json({ message: err.message });
  }
});

//Listagem dos bois -> Card
app.get('/cow', (req, res) => {
  const tempData = Cache.get('tempData');

  try {
    return res.status(200).json({
      tempIdCow: tempData.nTempIdOx,
      results: tempData.result,
      date: tempData.date,
      status: 200
    });
  } catch (err) {
    return res.json({ message: err.message });
  }
});

//Informações do gado específico 
app.get('/oxInfo/:idOx', async (req, res) => {
  const { idOx } = req.params;

  try {
    const getOx = await Cow.findById(idOx).exec();

    if (!getOx) {
      return res.status(400).json({
        mensagem: 'Não foi possível encontrar o gado selecionado',
        status: 400
      });
    }

    return res.status(200).json({
      cowData: {
        numId: getOx.numIdentificacao,
        nomeGado: getOx.nomeGado,
        fotoPerfil: getOx.fotoPerfil,
        status: getOx.status,
        historico: getOx.historico
      },
      status: 200
    });
  } catch (err) {
    return res.json({ message: err.message });
  }
});

//Atualizar Gado
app.put('/updateOx/:idOx', async (req, res) => {
  const { idOx } = req.params;
  const { status } = req.body;

  try {
    const getOx = await Cow.findById(idOx).exec();

    if (!getOx) {
      return res.status(400).json({ mensagem: 'Não foi possível encontrar o gado selecionado' });
    }

    await Cow.updateOne({ _id: idOx }, { $set: { status } });

    return res.status(200).json({ message: 'Status updated successfully' });
  } catch (err) {
    return res.json({ message: err.message });
  }
});

//Rotação de Imagem
app.post('/rotateImage', (req, res) => {
  const { img } = req.body;

  try {
    const imgBytes = base64.toByteArray(img.split(",")[1]);
    const imgBuffer = Buffer.from(imgBytes);

    const imgPil = new Image();
    imgPil.src = imgBuffer;

    const canvas = createCanvas(imgPil.width, imgPil.height);
    const ctx = canvas.getContext('2d');

    ctx.translate(imgPil.width / 2, imgPil.height / 2);
    ctx.rotate(Math.PI);
    ctx.drawImage(imgPil, -imgPil.width / 2, -imgPil.height / 2);

    const imgRotated = canvas.toDataURL(`image/${imgPil.src.split('.').pop()}`);

    return res.json({ rotatedImage: imgRotated });
  } catch (err) {
    return res.json({ message: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

//Rota pra quantidade de gados positivados e a porcentagem 

//Rota para o gráfico

//Rota de listagem dos gados

//Rota pra devolver todas as informações do boi específico

//Rota pra enviar as coisas pra IA e devolver as coisas

//Substituir a cadastrar gado a atualizar gado pra uma rota que depende se ele recebe o id ou não. Se ele não receber é cadastrar, se ele receber é atualizar.