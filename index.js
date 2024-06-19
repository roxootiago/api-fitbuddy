import express from "express";
import mongoose from "mongoose";
import Exercise from './models/exercises.js';
import Treino from './models/treinos.js';
import User from './models/user.js';

const app = express();
const port = 3000;

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
app.post("/users", async (request, response) => {
  const user = request.body;

  const newUser = await User.create(user);

  return response.json(newUser);
});

app.get("/users", async (req, res) => {
  try {
    const user = await User.aggregate([
      {
        $lookup: {
          from: "treinos",
          localField: "treino",
          foreignField: "_id",
          as: "treinoResult",
        },
      },
    ]);

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
app.delete("/user/:id", async (req, res) => {
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

  