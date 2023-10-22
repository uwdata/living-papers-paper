# The Living Papers Paper

The UIST'23 [Living Papers](https://github.com/uwdata/living-papers/) research paper and supplemental material.

View the paper and supplemental material online here:
[http://uwdata.github.io/living-papers-paper/](http://uwdata.github.io/living-papers-paper/)

Or, watch the [Living Papers overview video](https://www.youtube.com/watch?v=5-4wd3dVtEk).

To write your own articles, see the [main Living Papers repository](https://github.com/uwdata/living-papers/).

## Citation

To cite Living Papers in a research publication, please use the following citation data:

``` bibtex
@inproceedings{heer2023living,
  author = {Heer, Jeffrey and Conlen, Matthew and Devireddy, Vishal and Nguyen, Tu and Horowitz, Joshua},
  title = {Living Papers: A Language Toolkit for Augmented Scholarly Communication},
  year = {2023},
  url = {https://doi.org/10.1145/3586183.3606791},
  doi = {10.1145/3586183.3606791},
  booktitle = {Proceedings of the 36th Annual ACM Symposium on User Interface Software and Technology},
  articleno = {42},
  numpages = {13},
  series = {UIST '23}
}
```

## Build Instructions

- Clone this repo.
- Run `npm i` to install dependencies.
- Run `npm run build` to compile the article to the `build` folder.
- Run `npm run watch` to automatically recompile upon changes to `living-papers.md`.

If you are editing the article, be sure to place all figures, datasets, etc. in the `assets` folder.
