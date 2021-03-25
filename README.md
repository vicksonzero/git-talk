# git-talk

Talk about your git strategy with this standardized presentation tool



# talkML markup for describing git branching events, for the purpose of drawing them into a graph

# Road Map

- [ ] Construct a git tree in SVG by a series of events / commands:
  - [ ] Git commands
    - [ ] `commit: [node, newNodeID, title]`
    - [ ] `branch: [fromNode, newNodeID, lane, time, title]`
    - [ ] `merge: [fromNode, newNodeID, lane, time, title]`
    - [ ] `update: [node, title]`
    - [ ] `cherrypick: [node, newNodeID, lane, time, title]` // copy node to somewhere
    - [ ] `rebase: [oldBase, branch, ontoNewBase]`
  - [ ] Diagram controls
    - [ ] `lane: [laneID, afterLane, color, title]` // color in hex integer or a hex string
    - [ ] `node: [nodeID, lane, time, title]` // create a node anywhere
    - [ ] `connect: [edgeID, node1, node2, title?]` // connect any two nodes
    - [ ] `animated: [(true/false/"pop")]`
    - [ ] `erase: [(node/edge/lane)]` // wipe existence. other linked items will also be deleted
    - [ ] `disable: [(node/edge/lane)]` // still show it but gray out
    - [ ] `clear` // clear whole graph
    - [ ] `scroll: [fromTime]`
    - [ ] `zoom: level`
    - [ ] `focus: (node/edge/lane)`
- [ ] Render descriptions and step through each diagrams
- [ ] Support for animations









<hr />



<p align="center">
  <a href="https://www.gatsbyjs.com/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter">
    <img alt="Gatsby" src="https://www.gatsbyjs.com/Gatsby-Monogram.svg" width="60" />
  </a>
</p>
<h1 align="center">
  Gatsby minimal starter
</h1>

## 🚀 Quick start

1.  **Create a Gatsby site.**

    Use the Gatsby CLI to create a new site, specifying the minimal starter.

    ```shell
    # create a new Gatsby site using the minimal starter
    npm init gatsby
    ```

2.  **Start developing.**

    Navigate into your new site’s directory and start it up.

    ```shell
    cd my-gatsby-site/
    npm run develop
    ```

3.  **Open the code and start customizing!**

    Your site is now running at http://localhost:8000!

    Edit `src/pages/index.js` to see your site update in real-time!

4.  **Learn more**

    - [Documentation](https://www.gatsbyjs.com/docs/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)

    - [Tutorials](https://www.gatsbyjs.com/tutorial/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)

    - [Guides](https://www.gatsbyjs.com/tutorial/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)

    - [API Reference](https://www.gatsbyjs.com/docs/api-reference/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)

    - [Plugin Library](https://www.gatsbyjs.com/plugins?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)

    - [Cheat Sheet](https://www.gatsbyjs.com/docs/cheat-sheet/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)
