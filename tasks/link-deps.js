const fs = require('fs');
const { shellSync: exec } = require('execa');
const { sync: del } = require('del');
const path = require('path');

const customLinkersMap = {
  'bpmn-io/form-js': linkFormJs
};

const demoDir = path.join(__dirname, '..');
const dependenciesDir = path.join(__dirname, '.linked-dependencies');

const formJsRef = process.env.FORM_JS_BRANCH || 'develop';

const dependencies = [ {
  repo: 'bpmn-io/form-js',
  ref: formJsRef
} ];
linkDependencies(dependencies);

/**
  * @typedef Dependency
  * @property {string} repo
  * @property {string} ref - branch or tag or commit
  */

/**
  * Link client dependencies from specified repo and reference.
  *
  * @param {Dependency[]} dependencies
  */
async function linkDependencies(dependencies) {
  if (!dependencies.length) {
    console.log('No dependencies to link detected, exiting.');
    return;
  }

  del(dependenciesDir);
  fs.mkdirSync(dependenciesDir);

  for (const dependency of dependencies) {
    const link = customLinkersMap[dependency.repo] || linkFromGitHub;
    const dependencyName = `${dependency.repo}#${dependency.ref}`;

    console.log(`Linking ${dependencyName}...`);
    try {
      await link(dependency);
      console.log(`Linked ${dependencyName}.`);
    } catch (error) {
      console.error(`Unable to link ${dependencyName} due to error:`, error);
      console.log('Exiting.');
      process.exit(1);
    }
  }
}

/**
  *
  * @param {Dependency} dependency
  */
function linkFromGitHub({ repo, ref }) {
  exec(`npm i ${repo}#${ref}`, { cwd: demoDir });
}

/**
  *
  * @param {Dependency} dependency
  */
function linkFormJs({ repo, ref }) {
  gitClone(repo);
  console.log(`Cloned ${repo}.`);

  const rootDir = path.join(dependenciesDir, 'form-js');
  exec(`git checkout ${ref}`, { cwd: rootDir });
  console.log(`Checked out ${ref}.`);

  exec('npm ci', { cwd: rootDir });
  console.log('Installed dependencies.');

  exec('npm run build-distro', { cwd: rootDir });
  console.log('Built distro.');

  // link form-js
  const formJsDir = path.join(rootDir, 'packages', 'form-js');
  exec('yarn link', { cwd: formJsDir });

  exec('yarn link @bpmn-io/form-js', { cwd: demoDir });
  console.log('Linked @bpmn-io/form-js.');

  // link form-js-playground
  const playgroundDir = path.join(rootDir, 'packages', 'form-js-playground');
  exec('yarn link', { cwd: playgroundDir });

  exec('yarn link @bpmn-io/form-js-playground', { cwd: demoDir });
  console.log('Linked @bpmn-io/form-js-playground.');
}

function gitClone(repo) {
  const repoUrl = getRepoUrl(repo);

  exec(`git clone ${repoUrl}`, { cwd: dependenciesDir });
}

function getRepoUrl(repo) {
  return `https://github.com/${repo}.git`;
}
