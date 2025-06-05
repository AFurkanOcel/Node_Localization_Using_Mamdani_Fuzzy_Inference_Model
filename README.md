# Node Localization Using Mamdani Fuzzy Inference Model

This project addresses the node localization problem in **Wireless Sensor Networks (WSNs)** using a **Mamdani-type fuzzy inference system**. The goal is to estimate the positions of unknown nodes and minimize the **Average Localization Error (ALE)**.

## 🎯 Project Objective

To predict the coordinates of unknown nodes in WSNs by applying fuzzy logic techniques, aiming to reduce localization error and improve accuracy.

## 🧠 Methodology

- **Fuzzy Inference Type:** Mamdani
- **Membership Functions:** Triangular, Gaussian
- **Defuzzification Methods:** Center of Sums, Weighted Average  
- A total of 4 combinations were tested for performance comparison.

## 📊 Performance Metrics

| Metric      | Value   |
|-------------|---------|
| MAE         | 0.234   |
| RMSE        | 0.305   |
| Accuracy    | 69.0%   |

**Best performing setup:** Gaussian membership + Weighted Average defuzzification

## 🗃️ Dataset

- 107 samples with 6 attributes  
- Inputs: Anchor ratio, transmission range, node density, number of iterations  
- Output: Average Localization Error (ALE)

## 🚀 Future Work

- Comparison with Sugeno-type fuzzy systems  
- Testing on larger and more complex datasets  
- Real-time deployment in physical WSN environments

## 👥 Authors

- [**A. Furkan Öcel**](https://github.com/AFurkanOcel)  
- [**Halil Alpak**](https://github.com/HalilALPAK)  

## 🤝 Contributions

Feel free to open issues or pull requests to improve the project.
