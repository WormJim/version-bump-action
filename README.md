## About

A Github action, No Docker, to bump your packages. This attempts to follow SemVer2.0.

---

## Usage

### Workflow

```yaml
name: CI

on:
  push:
    branches: [main]

jobs:
  bump-version:
    name: Bump Version on Main
    runs-on: ubuntu-latest

    steps:
      - name: Bump Version
        id: version-bump
        uses: WormJim/version-bump-action@v0.1.0
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          commit_message: Bump version to {{version}}
          minor: Feature, Feat, feat
          patch: Patch, Fix, ''

      - name: Show Version Bump
        run: |
          echo "Bumped Version to ${{ steps.version-bump.outputs.version }}"
```

## Keys

### inputs

Use the following inputs with the `steps.with` key

| Key               | Default Value                     | Type    | Description                                                                         |
| ----------------- | --------------------------------- | ------- | ----------------------------------------------------------------------------------- |
| `token`           | `${{ github.token }}`             | String  | Github Public Access Token                                                          |
| `commit_message`  | `CI: Bump version to {{version}}` | String  | (Optional) Set the commit message for the version bump                              |
| `path_to_package` | `${{ github.workspace }}`         | String  | (Optional) The path to the repositories package.json in the current Github Runner   |
| `tag`             | `false`                           | Boolean | (Optional) If true (default false) a version tag is pushed                          |
| `major`           | `BREAKCING CHANGE,major`          | String  | (Optional) Phrases to test head commit against. Your inputs extend default phrases. |
| `minor`           | `feature,minor`                   | String  | (Optional) Phrases to test head commit against. Your inputs extend default phrases. |
| `patch`           | `''`                              | String  | (Optional) Phrases to test head commit against. Your inputs extend default phrases. |
| `ref`             | `${{ github.ref }}`               | String  | (Optional) The target branch to push the version bump commit to.                    |

### outputs

The Following outputs will be emitted

| Key       | Default Value | Type   | Description                               |
| --------- | ------------- | ------ | ----------------------------------------- |
| `version` | `0.1.0`       | String | The version to which your repo was bumped |

## License

Umm...Sure!
