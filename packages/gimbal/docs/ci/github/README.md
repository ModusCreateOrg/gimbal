# GitHub Actions

Simply add the following YML section in your Actions job:

```yml
- name: Performance Budgeting Regression Testing
  uses: ModusCreateOrg/gimbal/action@master
  env:
    GITHUB_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```


Use the [sample workflow](./workflow.yml) to learn how to integrate Gimbal with GitHub Actions.
