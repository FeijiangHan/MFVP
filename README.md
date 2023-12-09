
- [Implemented Clustering Algorithms](#implemented-clustering-algorithms)
  - [G Class: Clustering algorithm based on Graph2Vec graph embedding g\_graph2vec\_clustering.py](#g-class-clustering-algorithm-based-on-graph2vec-graph-embedding-g_graph2vec_clusteringpy)
  - [G Class: Clustering algorithm based on graph edit distance](#g-class-clustering-algorithm-based-on-graph-edit-distance)
  - [G Class: Clustering based on graph kernel g\_graph\_kernel.py](#g-class-clustering-based-on-graph-kernel-g_graph_kernelpy)
  - [T Class: Clustering based on tree edit distance t\_tree\_edit\_distance.py](#t-class-clustering-based-on-tree-edit-distance-t_tree_edit_distancepy)
  - [S Class: Clustering based on Word2Vec s\_cbow.py](#s-class-clustering-based-on-word2vec-s_cbowpy)
  - [S Class: Clustering based on Bert s\_bert.py](#s-class-clustering-based-on-bert-s_bertpy)
  - [S Class: Clustering based on GloVe s.glove\_clustering.py](#s-class-clustering-based-on-glove-sglove_clusteringpy)
  - [S Class: Clustering based on SimCSE s.simcse\_clustering.py](#s-class-clustering-based-on-simcse-ssimcse_clusteringpy)
- [Fronend Platform Introduction](#fronend-platform-introduction)
  - [Screenshots](#screenshots)
  - [New Feature - FCTree Visualization](#new-feature---fctree-visualization)
  - [Online Demo](#online-demo)
  - [Intellectual Property](#intellectual-property)
  - [Development Progress](#development-progress)
  - [Quick Start](#quick-start)
    - [Install dependencies](#install-dependencies)
    - [Local development](#local-development)
    - [Build](#build)
  - [Learn More](#learn-more)


# Implemented Clustering Algorithms

*s_cbow.py is used to obtain the related results of Word2Vec (CBOW)*

*s.glove_clustering.py is used to obtain the related results of GloVe*

*s.bert.py is used to obtain the related results of Bert*

*s.simcse_clustering.py is used to obtain the related results of simcse*

*s_cbow_pretrain.py is used to obtain the pre-training model of word2vec with additional features*

*s_cbow_mor.py is used to obtain the related results of word2vec with additional features*

*t_tree_clustering.py is used to construct models related to Tree edit distance*

*t_tree_edit_distance.py is used to obtain the related results of Tree edit distance*

*t_tree_edit_distance.py obtains the related results of Tree edit distance in another way*

*t_tree_kernel.py is used to obtain the related results of Tree Kernel*

*g_graph2vec_clustering.py is used to obtain the related results of graph embedding (graph2vec)*

*g_graph_edit_distance.py is used to obtain the related results of graph edit distance*

*g_graph_kernel.py is used to obtain the related results of graph kernel.*



## G Class: Clustering algorithm based on Graph2Vec graph embedding g_graph2vec_clustering.py

The basic idea of Graph2Vec: It introduces the Skipgram model in word2vec to graphs. In word2vec, the core idea of Skipgram is that words appearing in similar contexts tend to have similar semantics, so they should have similar vector representations. In Graph2Vec, a graph can be seen as a text, and all nodes within a fixed window of the target node can be seen as its context.

In our scenario, we first generate the corresponding graph structure based on the sequence data of function calls, and obtain the input data.

In the encoding stage, we use the Graph2Vec model to obtain a vector representation for each sample.

Finally, in the clustering stage, we use t-SNE + dbscan to display and cluster the results.

**Paper:** graph2vec: Learning Distributed Representations of Graphs

Link: https://arxiv.org/abs/1707.05005



## G Class: Clustering algorithm based on graph edit distance

The graph edit distance (GED) based clustering algorithm is a clustering method that uses the edit distance to measure the similarity between graphs for clustering. By calculating the edit distances between graphs, it can judge the level of similarity between them, and cluster similar graphs together.



## G Class: Clustering based on graph kernel g_graph_kernel.py

A graph kernel is a function that measures the similarity between graphs by mapping them to some Hilbert space. It can be used for graph clustering by first computing the kernel similarity between all graph pairs, and then applying traditional clustering algorithms like k-means on the resultant kernel matrix.

The process includes:

1. Graph kernel selection: Choose an appropriate graph kernel method according to the graph type and task.
2. Kernel computation: Compute the kernel similarity matrix between all graph pairs using the selected kernel method. This implicitly maps each graph to some feature space.
3. Clustering: Apply a clustering algorithm like k-means on the similarity matrix to group similar graphs together.
4. Evaluation: Check the clustering quality using metrics like accuracy.

Using graph kernels for clustering has the advantage of jointly considering both graph structure and node features, without requiring costly graph matching. It has shown promising results on both unattributed and attributed graphs.

**paper：A survey on graph kernels**

link：https://appliednetsci.springeropen.com/articles/10.1007/s41109-019-0195-3

**paper：Weisfeiler-Lehman Graph Kernels**

link：https://arxiv.org/abs/1906.01277



## T Class: Clustering based on tree edit distance t_tree_edit_distance.py

- Construct hierarchical trees

In the preprocessing step, hierarchical trees are constructed from the program dependency graphs based on code semantics.

- Compute tree edit distance

Tree edit distance is used to measure the dissimilarity between different samples' hierarchical trees.

- Hierarchical clustering

Based on the tree edit distance matrix, hierarchical agglomerative clustering is performed to group similar samples into clusters.

- Evaluation

Internal and external evaluations are conducted to evaluate the clustering quality.

The key steps involve:

1. Hierarchical tree construction from graph structures
2. Tree edit distance computation
3. Hierarchical clustering based on edit distances
4. Clustering evaluation

By modeling program semantics as hierarchical trees and leveraging tree edit distance, this approach can capture both syntax and semantics information for function clustering.

**paper：**NED: An Inter-Graph Node Metric Based On Edit Distance

link：https://arxiv.org/abs/1602.02358



## S Class: Clustering based on Word2Vec s_cbow.py

Word2Vec is an algorithm used to generate word embeddings, which are dense vector representations of words. These word representations capture semantic meanings and relationships between words. Word2Vec has two main implementations:

- Continuous Bag-of-Words (CBOW)
- Skip-gram

CBOW model predicts the current word based on the context words within a given window size.

To perform text clustering using Word2Vec and CBOW model:

1. Pre-train Word2Vec using CBOW on a large corpus to obtain word embeddings.
2. Represent documents as average of word vectors.
3. Perform clustering (e.g. k-means) on the document representations to group similar documents.

The advantages are:

- Word2Vec learns feature representations without human effort.
- CBOW embeddings captures semantic and syntactic similarities between words.
- Averaging word vectors preserves order-invariance in document representation.

This allows meaningful clustering of texts based on semantics rather than exact word matching.

**paper：Efficient Estimation of Word Representations in Vector Space**

paperlink：https://arxiv.org/abs/1301.3781



## S Class: Clustering based on Bert s_bert.py

BERT (Bidirectional Encoder Representations from Transformers) is a Natural Language Processing (NLP) model proposed by Google Researchers. It is a topic modeling technique that uses transformers and class-based TF-IDF to generate dense clusters [1].

BERT is a pre-trained model that has been trained on a large amount of text data to understand the context and meaning of words and sentences. It is designed to capture the bidirectional relationships between words in a sentence, allowing it to understand the context in which a word is used.

BERT can be used for clustering because it generates high-quality word and sentence embeddings. Word embeddings are numerical representations of words that capture their semantic meaning, while sentence embeddings capture the overall meaning of a sentence. These embeddings can be used to measure the similarity or distance between words or sentences.

In the context of clustering, BERT can be used to calculate the similarity between sentences and group similar sentences together. By representing sentences as embeddings, BERT can capture the semantic similarity between sentences, even if they are written in different ways. This allows BERT to identify sentences with similar contexts and cluster them together.

One common approach to clustering with BERT is to use the K-means clustering algorithm. By representing sentences as embeddings using BERT, K-means can group similar sentences together based on their embeddings. This can be useful in various NLP tasks such as document clustering, sentiment analysis, and text classification.

**paper：BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding**

paperlink：https://arxiv.org/abs/1810.04805



## S Class: Clustering based on GloVe s.glove_clustering.py

GloVe (Global Vectors for Word Representation) is an unsupervised learning algorithm for obtaining vector representations for words. It trains on global word-word co-occurrence statistics from a corpus, and the resulting representations showcase interesting linear substructures of the word vector space.

To perform text clustering using GloVe:

1. Pre-train GloVe model on a large corpus to obtain word embeddings.
2. Represent documents as average of word vectors.
3. Perform clustering (e.g. k-means) on the document representations.

Some advantages are:

- GloVe learns embeddings without human effort from raw co-occurrence counts.
- It produces meaningful substructures like gender/tense similarities.
- Averaging preserves order-invariance in document representation.

This allows clustering texts based on how their average semantic meanings relate, rather than exact word similarities. GloVe has been shown effective for various document classification tasks.

paperlink：[https://www.aclweb.org/anthology/D14-1162](https://link.zhihu.com/?target=https%3A//links.jianshu.com/go%3Fto%3Dhttps%3A%2F%2Fwww.aclweb.org%2Fanthology%2FD14-1162)

Github：[https://github.com/stanfordnlp/GloVe](https://link.zhihu.com/?target=https%3A//links.jianshu.com/go%3Fto%3Dhttps%3A%2F%2Fgithub.com%2Fstanfordnlp%2FGloVe)



## S Class: Clustering based on SimCSE s.simcse_clustering.py

SimCSE (Simple Contrastive Learning of Sentence Embeddings) is an unsupervised technique that learns universal sentence representations from unlabeled data.

The key steps for text clustering using SimCSE are:

1. Pre-train a language model (e.g. BERT) on a large corpus using SimCSE. This produces sentence embeddings.
2. Obtain sentence representations by passing each sentence through the pre-trained model.
3. Perform clustering (e.g. k-means) on the sentence embeddings to group similar texts.

Some advantages are:

- SimCSE is an self-supervised approach that learns from raw text without labels.
- It produces embeddings optimized for semantic equivalence rather than syntactic similarity.
- Sentences with similar meanings but different wordings are closer in the embedding space.
- This allows grouping texts based on semantic relatedness rather than surface form similarities.

SimCSE has been shown effective on several semantic textual similarity benchmarks.

**paper：SimCSE: Simple Contrastive Learning of Sentence Embeddings**

link：https://arxiv.org/abs/2104.08821





# Fronend Platform Introduction

This project is a malware cluster and visualization platform developed using the Create React App scaffolding. It is used for training cluster models on the front-end.

## Screenshots

![screenshot1](https://feijiang.info/details/markdown/assets/image-20231111214519387.png){:width="50%"}
![screenshot2](https://feijiang.info/details/markdown/img/web-01.png){:width="50%"}

## New Feature - FCTree Visualization

![screenshot2](https://feijiang.info/details/markdown/img/image-20231011184940562.png){:width="80%"}

## Online Demo

You can view this video for a product demonstration:

https://www.bilibili.com/video/BV1Ld4y1L7Ui/?vd_source=e71838ed2f2728c3c6a06ef2d52820d0/

## Intellectual Property 

We have obtained an authorized patent for this project (Patent No. CN115952230A)

## Development Progress

The backend technologies and data will be kept private for now and will be open sourced after product release.

## Quick Start

### Install dependencies

```
npm install
```

### Local development

```
npm start
```

### Build

```
npm run build
```

## Learn More

For more usage instructions, please refer to the Create React App documentation: 

https://facebook.github.io/create-react-app/docs/getting-started

To learn React basics, visit:

https://reactjs.org/

This README is intended to provide developers an overview of the product functionality, screenshots, video demo link, IP statement, and development progress. 

The standard Create React App scaffolding is used to quickly build the front-end application for easy maintenance and learning going forward.
