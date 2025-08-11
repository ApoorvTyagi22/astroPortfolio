---
title: "Tetris Game using Java"
subtitle: "A tile-matching puzzle game created using Java"
date: "6/8/2024"
---

## Note

The code for this project can be found on [GitHub](https://github.com/ApoorvTyagi22/Tetris.git). The code is fully documented. Some images may take a while to load.

## Introduction

This is a Tetris game created using java. The project is built using the maven architecture. Tetris is a tile-matching puzzle game. Consisting of a matrix of cells, where each cell can be empty or filled with a block. The player can move and rotate the
blocks to fill the rows of the matrix. When a row is filled, it is removed from the matrix. The player loses a life when the time runs out, the game ends when the player loses all lives. The GUI of the game is created using JavaFX.

## Background

### Maven

This project has been built using Maven. Maven is a build automation tool used primarily for Java projects. Maven provides the following benefits:

1. Dependency Management. Maven simplifies the process of including external libraries or dependencies, all you need to do is add the dependency to the pom.xml file. It will automatically download the dependency from the Maven repository.
2. Build Automation. Maven provides a standard way to build, test, and package your project. You can run the build process using the mvn command.
3. Project Structure. Maven enforces a standard project structure, which makes it easier to organize your code and resources.

Due to these benefits, Maven is widely used in the Java community.

### JavaFX

This project uses JavaFX for the GUI. JavaFX is a set of graphics and media packages that enables developers to design, create, test, debug, and deploy rich client applications that operate consistently across diverse platforms.
We used multiple different JavaFX components to create the game, such as:

1. **Scene**: The scene is the container for all content in a scene graph. The scene graph is a hierarchical tree of nodes that represents all of the visual elements of the application window.
2. **Stage**: The stage is the top-level container for a JavaFX application. The primary stage is created by the platform.

## Implementation

The project is divided into the following packages:

1. **components**: Contains the classes for the different components of the game.
2. **event**: Contains the listener classes for the different events of the game.
3. **game**: Contains the main game logic.
4. **Media**: Contains the multimedia classes for the game.
5. **network**: Contains the classes for the network connection.
6. **scene**: Contains the classes for the different scenes of the game.
7. **ui**: Contains the classes for the user interface of the game.

We have several listeners for different events in the game. The project uses multiple oops concepts like **inheritance**, **encapsulation**, **polymorphism**, **abstraction** and **functional interface**. **lambda expressions** are used to implement the listeners, which makes the code more concise and readable.

### Listener Classes

We need to create listener classes because we want to separate the event handling logic from the game logic. This makes the code more modular
and easier to maintain. The listener classes are responsible for handling the different events of the game, such as key presses, mouse clicks, etc.
It makes use of the **Observer Pattern** to notify the game logic when an event occurs. In this pattern, we have a subject (the event) and an observer (the listener).
The observer notifies the subject whenever an event occurs. The listener pattern allows the game to notify other parts of the program when something significant occurs,
like a new piece being available.

The following is the implementation of the listeners:

1. Initialization. Setting the game up in build() method. The build() method is called in the start() method of the Main class, it is responsible for setting the
   game environment and registering event listeners.

The following is part of the build() method of the ChallengeScene class.

```java
        board.setOnBlockClick(this::blockClicked);
        pieceBaord.setOnBlockClick(this::pieceBoardClicked);
        game.setNextPieceListener(this::displayBlock);
        secondPieceBoard.setOnBlockClick(this::swapPieces);
        board.setOnRightClicked(() -> game.rotateCurrentPiece());
        game.setLinesClearedListener(this::linesCleared);

```

In this method, several listeners are set, but the most important one for us is the setNextPieceListener() method.
The game registers displayBlock() as a listener for the next piece event. This method is called whenever a new piece is available for the player to use.

2. The game class has a method called setNextPieceListener():

```java
        public void setNextPieceListener(NextPieceListener listener) {
        logger.debug("2: Set as the listener {}", listener);
        this.nextPieceListener = listener;
        }
```

This method sets the listener for the next piece event. The listener parameter, which is an object that implements the NextPieceListener interface, is saved for future use.
whenever the game logic determines new piece is available, it calls the callToListener() method.

```java
        public void callToListener() {
            if (nextPieceListener != null) {
                nextPieceListener.nextPiece(currentPiece, followingPiece);
            }
        }
```

so calling the listener will send the currentPiece and followingPiece to the listener (displayBlock() method in our case). The listener can then use this information to update the game board.

## Conclusion

We discussed how to create a game using Java and JavaFX. We also learned about the Maven build system and how to use it to manage dependencies and build our project. We implemented several design patterns like the observer pattern and used several oops concepts like inheritance, encapsulation, polymorphism, abstraction, and functional interfaces. We also learned how to use lambda expressions to make our code more concise and readable.
