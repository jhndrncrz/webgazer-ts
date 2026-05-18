# Credits & Acknowledgments

## 🏛️ Built on the Shoulders of Giants

**webgazer-ts would not exist without the pioneering research of the WebGazer.js team at Brown University's Human-Computer Interaction Group.**

The algorithms, methodology, regression approach, Kalman filter design, eye-patch feature extraction, calibration strategy, and overall architecture of this library are all derived directly from their original work. This TypeScript rewrite is a faithful port — nothing more. Every time this library correctly predicts where someone is looking at a screen, the credit belongs to them.

---

## 🔬 Original Research

### WebGazer.js — Brown HCI Group

> **"WebGazer: Scalable Webcam Eye Tracking Using User Interactions"**
>
> *Proceedings of the 25th International Joint Conference on Artificial Intelligence (IJCAI), 2016, pp. 3839–3845*

**→ [Read the Paper (PDF)](http://cs.brown.edu/people/apapouts/papers/ijcai2016webgazer.pdf)**
**→ [Project Website](https://webgazer.cs.brown.edu)**
**→ [Official Repository](https://github.com/brownhci/WebGazer)**

This paper introduced the core insight that powers WebGazer: that ordinary webcam sessions — with users clicking links, reading text, and interacting with pages naturally — provide enough signal to train an accurate, real-time gaze estimator entirely in the browser. No specialist hardware. No lab setup. No dedicated calibration phase. The elegance of this idea is the reason eye tracking became accessible to web developers at all.

### BibTeX Citation

**Please always cite the original WebGazer.js paper, not this TypeScript rewrite.**

```bibtex
@inproceedings{papoutsaki2016webgazer,
  author    = {Alexandra Papoutsaki and Patsorn Sangkloy and James Laskey
               and Nediyana Daskalova and Jeff Huang and James Hays},
  title     = {{WebGazer}: Scalable Webcam Eye Tracking Using User Interactions},
  booktitle = {Proceedings of the 25th International Joint Conference
               on Artificial Intelligence ({IJCAI})},
  pages     = {3839--3845},
  year      = {2016},
  url       = {https://webgazer.cs.brown.edu}
}
```

---

## 👩‍🔬 The People Behind WebGazer.js

These are the researchers and developers who created what this library is built upon. This list is reproduced from the official WebGazer.js repository and website with deep appreciation.

### Creators & Core Researchers

| Person | Role |
|--------|------|
| **[Alexandra Papoutsaki](http://cs.brown.edu/people/apapouts/)** | Creator, lead researcher, and primary author of the foundational algorithm and IJCAI paper. Developed WebGazer during her PhD at Brown and continued development at Pomona College. |
| **[Jeff Huang](https://jeffhuang.com/)** | Co-author, project advisor, and long-term maintainer. Professor at Brown University's CS department and PI of the [Brown HCI Group](https://hci.cs.brown.edu/). |
| **[James Hays](https://faculty.cc.gatech.edu/~hays/)** | Co-author. Computer vision expert, contributed to the feature extraction and regression methodology. |
| **[Patsorn Sangkloy](https://psangkloy.com/)** | Co-author on the IJCAI 2016 paper. |
| **[James Laskey](https://github.com/jlaskey)** | Co-author on the IJCAI 2016 paper. |
| **[Nediyana Daskalova](https://nediyana.com/)** | Co-author on the IJCAI 2016 paper. |
| **Aaron Gokaslan** | Core developer, significant contributor to the JavaScript implementation. |
| **James Tompkin** | Research advisor and collaborator at Brown University. |

### Additional Contributors

The WebGazer.js open-source project has received contributions from many developers over the years. A full list of contributors can be found at:
**→ [github.com/brownhci/WebGazer/graphs/contributors](https://github.com/brownhci/WebGazer/graphs/contributors)**

---

## 📄 Full Publication List

The research program around WebGazer.js spans multiple papers. If your work touches on any of these topics, please consider citing the relevant publication:

| Year | Paper | Venue |
|------|-------|-------|
| 2016 | [**WebGazer: Scalable Webcam Eye Tracking Using User Interactions**](http://cs.brown.edu/people/apapouts/papers/ijcai2016webgazer.pdf) | IJCAI |
| 2017 | [**SearchGazer: Webcam Eye Tracking for Remote Studies of Web Search**](https://webgazer.cs.brown.edu/research/chi17.pdf) | CHIIR |
| 2018 | [**The Eye of the Typer: A Bi-Relationship Between Gaze and Typing Behaviors**](https://webgazer.cs.brown.edu/research/etra18.pdf) | ETRA |

Full list with PDFs: **→ [webgazer.cs.brown.edu/#publications](https://webgazer.cs.brown.edu/#publications)**

---

## 🏛️ Funding & Institutional Support

The original WebGazer.js research was supported by:

- **National Science Foundation** grants IIS-1464061 and IIS-1552663
- **Brown University** Salomon Faculty Research Award
- **Pomona College** (continued development and research)

---

## 🔧 Other Dependencies

| Library | Authors | Purpose |
|---------|---------|---------|
| [TensorFlow.js](https://www.tensorflow.org/js) | Google Brain / TF.js team | ML inference engine for FaceMesh |
| [@tensorflow-models/face-landmarks-detection](https://github.com/tensorflow/tfjs-models) | Google / MediaPipe team | 468-point facial landmark detection |
| [LocalForage](https://localforage.github.io/localForage/) | Mozilla contributors | Cross-browser persistent storage |
| [React](https://react.dev/) | Meta / React core team | UI component library (`@webgazer-ts/react`) |

---

## 📜 License

**Original WebGazer.js:** GPL-3.0 (with LGPL-3.0 option for companies valued under $1M USD at time of use).
→ Commercial inquiries: webgazer@lists.cs.brown.edu

**webgazer-ts:** GPL-3.0-or-later (same terms, matching the original).

This library is a derivative work under GPL-3.0. The license requires that any software incorporating it must also be released under GPL-3.0-compatible terms.

---

## 🙏 A Personal Note

The original WebGazer.js made webcam-based eye tracking possible for every web developer with a laptop. Before it, gaze tracking required expensive hardware, specialized software, and a lab environment. After it, a researcher with a standard webcam and a JavaScript file could run a user study anywhere in the world.

This TypeScript rewrite exists solely because that work was good enough to be worth preserving with modern tooling. Every line of this codebase reflects decisions made first by the Brown HCI team. We are grateful for their generosity in open-sourcing such a significant piece of research infrastructure.

**Thank you to Alexandra Papoutsaki, Jeff Huang, and the entire WebGazer.js team.** 🙏

---

*webgazer-ts is not affiliated with, endorsed by, or officially connected to Brown University or the WebGazer.js project.*