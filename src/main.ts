import * as core from '@actions/core'
import * as github from '@actions/github'

const context = github.context
const {owner, repo} = context.issue
const issue_number = context.issue.number
const token = core.getInput('repo-token', {required: true})
const octokit = github.getOctokit(token)

async function run(): Promise<void> {
  try {
    core.debug(context.issue.number.toString())

    const labels = await octokit.issues.listLabelsOnIssue({
      owner,
      repo,
      issue_number
    })

    const labelNames = labels.data.map(e => e.name)

    if (labelNames.includes('published')) return

    for (const label of labels.data) {
      if (label.name === 'publish') await onPublish()
      else if (label.name === 'accepted') await onAccepted()
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

async function onPublish(): Promise<void> {
  await octokit.issues.removeLabel({
    owner,
    repo,
    issue_number,
    name: 'publish'
  })

  await octokit.issues.removeLabel({
    owner,
    repo,
    issue_number,
    name: 'accepted'
  })

  await octokit.issues.addLabels({
    owner,
    repo,
    issue_number,
    labels: ['published']
  })

  await octokit.issues.createComment({
    owner,
    repo,
    issue_number,
    body: 'Your submission was published!'
  })
}

async function onAccepted(): Promise<void> {
  await octokit.issues.createComment({
    owner,
    repo,
    issue_number,
    body: 'Your submission was accepted! It will be published soon.'
  })
}

run()
