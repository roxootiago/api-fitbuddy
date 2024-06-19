import express from "express";
import mongoose from "mongoose";
import Exercise from './models/exercises.js';
import Treino from './models/treinos.js';
import User from './models/user.js';
import upload from "./middleware/multer.js"
import { cloudinary } from "./utils/cloudinary.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

/* Rotas dos exercícios */
app.get("/exercises",async (req, res) => {
  const exercise = await Exercise.find()
  return res.json(exercise);
});

app.get("/exercises/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const exercise = await Exercise.findById(id);

    if (exercise) {
      return res.json(exercise);
    } else {
      return res.status(404).send("Exercise not found");
    }
  } catch (error) {
    console.error("Exercise fetching exercise:", error);
    return res.status(500).send("Internal Server Error");
  }
});

app.post("/exercises", async (request, response) => {
  const exercise = request.body;

const newExercise = await Exercise.create(exercise)

  return response.json(newExercise);
});

app.put("/exercises/:id", async (req, res) => {
  const { id } = req.params;
  const exerciseData = req.body;

  try {
    const updatedExercise = await exercise.findByIdAndUpdate(id, exerciseData, {
      new: true,
    });

    if (updatedExercise) {
      return res.json(updatedExercise);
    } else {
      return res.status(404).send("Exercise not found");
    }
  } catch (error) {
    console.error("Error updating exercise:", error);
    return res.status(500).send("Internal Server Error");
  }
});

app.patch("/Exercises/:id", async (req, res) => {
  const { id } = req.params;
  const exerciseData = req.body;

  try {
    const updatedExercise = await Exercise.findByIdAndUpdate(id, exerciseData, {
      new: true,
    });

    if (updatedExercise) {
      return res.json(updatedExercise);
    } else {
      return res.status(404).send("Exercise not found");
    }
  } catch (error) {
    console.error("Error updating exercise:", error);
    return res.status(500).send("Internal Server Error");
  }
});
app.delete("/exercises/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedExercise = await Exercise.findByIdAndDelete(id);

    if (deletedExercise) {
      return res.status(204).send("Deleted exercise"); 
    } else {
      return res.status(404).send("Exercise not found");
    }
  } catch (error) {
    console.error("Error deleting exercise:", error);
    return res.status(500).send("Internal Server Error");
  }
});

/* Rotas dos treinos */

app.post("/treinos", async (request, response) => {
  const treino = request.body;

  const newTreino = await Treino.create(treino);

  return response.json(newTreino);
});

app.get("/treinos", async (req, res) => {
  try {
    const treinos = await Treino.aggregate([
      {
        $lookup: {
          from: "exercises",
          localField: "exercises",
          foreignField: "_id",
          as: "exerciseDetails",
        },
      },
    ]);

    res.json(treinos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put("/treinos/:id", async (req, res) => {
  const { id } = req.params;
  const exerciseData = req.body;

  try {
    const updatedExercise = await exercise.findByIdAndUpdate(id, exerciseData, {
      new: true,
    });

    if (updatedExercise) {
      return res.json(updatedExercise);
    } else {
      return res.status(404).send("Treino not found");
    }
  } catch (error) {
    console.error("Error updating treino:", error);
    return res.status(500).send("Internal Server Error");
  }
});

app.patch("/treinos/:id", async (req, res) => {
  const { id } = req.params;
  const exerciseData = req.body;

  try {
    const updatedExercise = await Exercise.findByIdAndUpdate(id, exerciseData, {
      new: true,
    });

    if (updatedExercise) {
      return res.json(updatedExercise);
    } else {
      return res.status(404).send("Treino not found");
    }
  } catch (error) {
    console.error("Error updating treino:", error);
    return res.status(500).send("Internal Server Error");
  }
});
app.delete("/treinos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedExercise = await Exercise.findByIdAndDelete(id);

    if (deletedExercise) {
      return res.status(204).send("Deleted treino");
    } else {
      return res.status(404).send("Treino not found");
    }
  } catch (error) {
    console.error("Error deleting treino:", error);
    return res.status(500).send("Internal Server Error");
  }
});


/* Rotas Usuário */

/* image upload function */
const handleUpload = async (req, res, next) => {
  try {
    // Verificar se foi feito o upload da imagem
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    // Upload da imagem para o Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Adicionar a URL da imagem no objeto de usuário
    req.body.imageProfile = result.secure_url;

    next();
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error uploading file" });
  }
};

// Rota para criar um novo usuário
app.post(
  "/users",
  upload.single("imageProfile"),
  handleUpload,
  async (request, response) => {
    const userData = request.body;

    try {
      const newUser = await User.create(userData);
      return response.json(newUser);
    } catch (error) {
      console.error("Error creating user:", error);
      return response.status(500).send("Internal Server Error");
    }
  }
);

// Rota para obter todos os usuários
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();

    // Mapear os usuários para adicionar o link da imagem do Cloudinary
    const usersWithImageUrl = users.map((user) => ({
      ...user.toObject(),
      imageProfile: user.imageProfile ? user.imageProfile : null,
    }));

    res.json(usersWithImageUrl);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (user) {
      return res.json(user);
    } else {
      return res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("User fetching exercise:", error);
    return res.status(500).send("Internal Server Error");
  }
});

app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const userData = req.body;

  try {
    const updatedUser = await user.findByIdAndUpdate(id, userData, {
      new: true,
    });

    if (updatedUser) {
      return res.json(updatedUser);
    } else {
      return res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).send("Internal Server Error");
  }
});

app.patch("/user/:id", async (req, res) => {
  const { id } = req.params;
  const userData = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(id, userData, {
      new: true,
    });

    if (updatedUser) {
      return res.json(updatedUser);
    } else {
      return res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).send("Internal Server Error");
  }
});
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (deletedUser) {
      return res.status(204).send("Deleted user");
    } else {
      return res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).send("Internal Server Error");
  }
});


app.listen(port, (err) => {
    if (err) console.log(`error message: ${err}`);
    console.log(`Server listening on http://localhost:${port}`);
});

mongoose
  .connect(
    "mongodb+srv://tiagorxsilva:5gS0Y7P2YiKo3RLT@fitbuddy.aoci0bs.mongodb.net/?retryWrites=true&w=majority&appName=FitBuddy"
  )
  .then(() => console.log(`Banco conectado`))
  .catch(() => console.log("Não conectado :<"));

  