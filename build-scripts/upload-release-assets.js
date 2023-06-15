// Used by the GitHub Actions CI workflow at .github/workflows/build.yml

module.exports = async ({github, context, tag}) => {
    const owner = context.repo.owner;
    const repo = context.repo.repo;
    const fs = require('fs').promises;
    const assetName = 'index.html';
    const assetPath = `dist/${assetName}`;

    console.log(`tag: ${tag}`);

    const release = github.rest.repos.createRelease({
        owner,
        repo,
        tag,
        make_latest: true
    });

    const data = await fs.readFile(assetPath);

    console.log("Uploading asset %s from %s...", assetName, assetPath);
    const uploadResponse = await github.rest.repos.uploadReleaseAsset({
      owner,
      repo,
      release_id: release.data.id,
      name: assetName,
      data
    });
    console.log("Upload response status: %s", uploadResponse.status);
  };
