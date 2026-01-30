---
fields:
  - name: id
    type: Number
    options:
      step: 1
      min: 1
    path: ""
    id: zYB2TC
  - name: person
    type: Select
    options:
      sourceType: ValuesList
      valuesList:
        "1": J.R.R. Tolkien
        "2": C.S. Lewis
        "3": Owen Barfield
        "4": Charles Williams
        "5": Warren Lewis
        "6": Inklings
    path: ""
    id: Xj4OSJ
  - name: name
    type: Input
    options: {}
    path: ""
    id: rAmigx
  - name: start
    type: Date
    options:
      dateShiftInterval: 1 day
      dateFormat: YYYY-MM-DD
      defaultInsertAsLink: false
      linkPath: ""
    path: ""
    id: cpEvpx
  - name: description
    type: Input
    options: {}
    path: ""
    id: lWzVb8
  - name: edtf
    type: Input
    options: {}
    path: ""
    id: sECHQM
  - name: priority
    type: Number
    options:
      step: 1
      min: 0
      max: 5
    path: ""
    id: PyN1tw
  - name: source
    type: Input
    options: {}
    path: ""
    id: fW1utv
  - name: note
    type: Input
    options: {}
    path: ""
    id: cVvCTg
  - name: type
    type: Select
    options:
      sourceType: ValuesList
      valuesList:
        "1": point
        "2": range
    path: ""
    id: zSESLR
  - name: end
    type: Date
    options:
      dateShiftInterval: 1 day
      dateFormat: YYYY-MM-DD
      defaultInsertAsLink: false
      linkPath: ""
    path: ""
    id: fFqZY3
  - name: address
    type: Input
    options: {}
    path: ""
    id: nOzhnX
  - name: category
    type: Select
    options:
      sourceType: ValuesList
      valuesList:
        "1": location
    path: ""
    id: uua7xK
  - name: people
    type: Multi
    options:
      sourceType: ValuesList
      valuesList:
        "1": J.R.R. Tolkien
        "2": C.S. Lewis
        "3": Owen Barfield
        "4": Charles Williams
        "5": Warren Lewis
    path: ""
    id: AIBLFG
  - name: status
    type: Select
    options:
      sourceType: ValuesList
      valuesList:
        "1": Draft
        "2": Fact-check
        "3": Check source trail
        "4": Add detail
        "5": Final
    path: ""
    id: 7UvjJj
version: "2.137"
limit: 20
mapWithTag: false
icon: package
tagNames:
filesPaths:
  - Events
bookmarksGroups:
excludes:
extends:
savedViews: []
favoriteView:
fieldsOrder:
  - zYB2TC
  - Xj4OSJ
  - uua7xK
  - rAmigx
  - sECHQM
  - cpEvpx
  - fFqZY3
  - lWzVb8
  - AIBLFG
  - zSESLR
  - PyN1tw
  - fW1utv
  - cVvCTg
  - nOzhnX
  - 7UvjJj
---
