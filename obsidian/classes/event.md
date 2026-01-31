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
  - name: title
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
  - name: oldsource
    type: Input
    options: {}
    path: NI4ifM
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
  - name: source
    type: Object
    options:
      displayTemplate: ""
    path: ""
    id: NI4ifM
  - name: page
    type: Number
    options:
      step: 1
    path: NI4ifM
    id: qPfSnC
  - name: comment
    type: Input
    options: {}
    path: NI4ifM
    id: Tep3UM
  - name: name
    type: Select
    options:
      sourceType: ValuesListNotePath
      valuesList: {}
      valuesListNotePath: other/sources.md
    path: NI4ifM
    id: bti6O7
  - name: accessed
    type: Date
    options:
      dateShiftInterval: 1 day
      dateFormat: YYYY-MM-DD
      defaultInsertAsLink: false
      linkPath: ""
    path: NI4ifM
    id: 5fpPgf
version: "2.162"
limit: 20
mapWithTag: false
icon: package
tagNames:
filesPaths:
  - events
bookmarksGroups:
excludes:
extends:
savedViews: []
favoriteView:
fieldsOrder:
  - NI4ifM
  - bti6O7
  - qPfSnC
  - fW1utv
  - 5fpPgf
  - Tep3UM
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
  - cVvCTg
  - 7UvjJj
---
