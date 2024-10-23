import fs from 'node:fs';
import path, { dirname } from 'node:path';
import { execaSync } from 'execa';
import { fileURLToPath } from 'node:url';
import { deleteSync } from 'del';
import qs from 'qs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const customLinkersMap = {
  'bpmn-io/form-js': linkFormJs
};

const DEFAULT_BRANCH = 'develop';

const demoDir = path.join(__dirname, '..');
const dependenciesDir = path.join(__dirname, '.linked-dependencies');

const formJsRef = getFormsBranch();

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

  deleteSync(dependenciesDir);
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
  execaSync({ shell:true })(`npm i ${repo}#${ref}`, { cwd: demoDir });
}

/**
  *
  * @param {Dependency} dependency
  */
function linkFormJs({ repo, ref }) {
  gitClone(repo);
  console.log(`Cloned ${repo}.`);

  const rootDir = path.join(dependenciesDir, 'form-js');
  execaSync({ shell:true })(`git checkout ${ref}`, { cwd: rootDir });
  console.log(`Checked out ${ref}.`);

  execaSync({ shell:true })('npm ci', { cwd: rootDir });
  console.log('Installed dependencies.');

  execaSync({ shell:true })('npm run build-distro', { cwd: rootDir });
  console.log('Built distro.');

  // link form-js
  const formJsDir = path.join(rootDir, 'packages', 'form-js');
  execaSync({ shell:true })('yarn link', { cwd: formJsDir });

  execaSync({ shell:true })('yarn link @bpmn-io/form-js', { cwd: demoDir });
  console.log('Linked @bpmn-io/form-js.');

  // link form-js-playground
  const playgroundDir = path.join(rootDir, 'packages', 'form-js-playground');
  execaSync({ shell:true })('yarn link', { cwd: playgroundDir });

  execaSync({ shell:true })('yarn link @bpmn-io/form-js-playground', { cwd: demoDir });
  console.log('Linked @bpmn-io/form-js-playground.');
}

function gitClone(repo) {
  const repoUrl = getRepoUrl(repo);

  execaSync({ shell:true })(`git clone ${repoUrl}`, { cwd: dependenciesDir });
}

function getRepoUrl(repo) {
  return `https://github.com/${repo}.git`;
}

function getFormsBranch() {
  return (
    process.env.FORM_JS_BRANCH ||
    process.env.INCOMING_HOOK_BODY && qs.parse(process.env.INCOMING_HOOK_BODY)['FORM_JS_BRANCH'] ||
    DEFAULT_BRANCH
  );
}