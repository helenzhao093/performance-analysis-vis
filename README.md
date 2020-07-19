# Performance Analysis of Probabilistic Classifiers

Performance analysis is a critical step in the training of machine learning models. Efficient performance analysis helps interpret classifiers, uncover reasons behind incorrect classifications, and assess of the reliability of predictions. Aggregrate metrics such as accuracy and precision obscure information about prediction probabilities and input values.

This web application addresses common classification practices and performance analysis of probabilistic classifiers.  Analytical tasks that the application supported include:
1. Examine and visualize overall performance of classifier
2. Visualize class-level performance of classifier through visualizing the distribution of false positives (FP), true positives (TP), false negatives (FN), and true negatives TN in each class.
3. Examine instance-level performance
4. Identify between-class confusion
5. Identify examples of interest such as FN with high confidence scores since these examples can be more easily shifted to the correct class and severe errors such as FP with high confidence scores or FN with low confidence scores.

## Upload file format 
Upload a valid csv file 
1. Header column includes class names, predicted, actual, Id (optional)
2. Each row corresponds to an example. The probability scores for each class, the predicted and actual labels are listed. 
To view a sample datafile, open example-data.csv  

## Quickstart

To get started:

```sh
npm init @open-wc
# requires node 10 & npm 6 or higher
```

## Scripts
- `start` runs your app for development, reloading on file changes
- `start:build` runs your app after it has been built using the build command
- `build` builds your app and outputs it in your `dist` directory
- `test` runs your test suite with Karma
- `lint` runs the linter for your project

## Tooling configs
For most of the tools, the configuration is in the `package.json` to reduce the amount of files in your project.
If you customize the configuration a lot, you can consider moving them to individual files.
