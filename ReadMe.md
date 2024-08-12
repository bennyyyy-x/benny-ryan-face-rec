# Benny and Ryan's Face Recognition Tool

This is a simple face recognition tool that uses `MTCNN` to detect and crop faces, and uses a pre-trained convolutional neural network (CNN) model to recognize faces using `Tensorflow` and `Keras`. The tool also includes a web interface built with `HTML` and `Express.js` as the backend.

## Prerequisites

This tool requires `Python`, `Node.js`, `pip`, and `npm` to run. If you don't have these installed, you can download them from the following links:

- [Download Python](https://www.python.org/downloads/)
- [Download Node.js](https://nodejs.org/)

## Installation

To install the dependencies, run the following commands.

For Windows/Linux, run:

```bash
pip install -r requirements.txt
npm install
```

For MacOS, run:

```bash
pip install -r requirements-macos.txt
npm install
```

## Usage

To use the tool, simply run the following command:

```bash
npm run dev
```

Then you can access the webpage at `localhost:8080`.

## Sample Webpage

![Sample Webpage](./assets/image.png)