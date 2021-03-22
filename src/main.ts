import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
    const context = github.context

    const {owner, repo} = context.issue
    const issue_number = context.issue.number

    const token = core.getInput('repo-token', {required: true})
    const octokit = github.getOctokit(token)
    core.debug(context.issue.number.toString())



    await octokit.issues.createComment({
      owner,
      repo,
      issue_number,
      body: 'Hello, World!'
    })

    let labels = octokit.issues.listLabelsOnIssue({
      owner,
      repo,
      issue_number
    })

    labels.then(e => {
      for (let eKey in e) {
        core.info(eKey)
      }
    })

  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
