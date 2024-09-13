const express = require("express");
const Instagram = require("scraper-instagram");
const app = express();
const port = 3000;

app.get("/instagram/:username", async (req, res) => {
  const { username } = req.params;
  const instagram = new Instagram();

  try {
    const profile = await instagram.getProfile(username);
    const posts = profile.edge_owner_to_timeline_media.edges
      .slice(0, 5)
      .map((edge) => edge.node.display_url);
    res.json(posts);
  } catch (error) {
    console.error("Error fetching Instagram data", error);
    res.status(500).send("Error fetching Instagram data");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
