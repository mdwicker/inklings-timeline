const rawData = [
    {
        "name": "Tolkien",
        "className": "tolkien",
        "hasSubgroups": true,
        "contents": [
            {
                "name": "Location",
                "className": "tolkien location",
                "hasSubgroups": false,
                "contents": [
                    {
                        "content": "Bloemfontein, South Africa",
                        "start": "1892-01-01",
                        "end": "1895-12-31",
                        "type": "range"
                    },
                    {
                        "content": "Birmingham and suburbs",
                        "start": "1896-01-01",
                        "end": "1911-09-30"
                    },
                    {
                        "content": "Oxford",
                        "start": "1911-10-01",
                        "end": "1915-04-01",
                        "type": "range"
                    },
                    {
                        "content": "Army",
                        "name": "Mostly training around Bedford and Staffordshire",
                        "start": "1915-04-01",
                        "end": "1916-11-08",
                        "type": "range"
                    },
                    {
                        "content": "France",
                        "start": "1916-06-06",
                        "type": "point"
                    },
                    {
                        "content": "Recovery",
                        "name": "Great Haywood, various camps and hospitals",
                        "start": "1916-11-09",
                        "end": "1918-10-31",
                        "type": "range"
                    },
                    {
                        "content": "Oxford",
                        "start": "1918-11-01",
                        "end": "1920-09-01",
                        "type": "range"
                    },
                    {
                        "content": "Leeds",
                        "start": "1920-09-01",
                        "end": "1926-01-07",
                        "type": "range"
                    },
                    {
                        "content": "5 Holly Bank",
                        "start": "1921-03-01",
                        "end": "1921-08-01",
                        "type": "range"
                    },
                    {
                        "content": "11 St Marks Terrace",
                        "start": "1921-08-01",
                        "end": "1924-03-17",
                        "type": "range"
                    },
                    {
                        "content": "2 Darnley Road",
                        "start": "1924-03-17",
                        "end": "1926-01-07",
                        "type": "range"
                    },
                    {
                        "content": "22 Northmoor Road, Oxford",
                        "start": "1926-01-07",
                        "end": "1930-01-14",
                        "type": "range"
                    },
                    {
                        "content": "20 Northmoor Road, Oxford",
                        "start": "1930-01-14",
                        "end": "1947-03-01",
                        "type": "range"
                    },
                    {
                        "content": "3 Manor Road, Oxford",
                        "start": "1947-03-01",
                        "end": "1953-03-30",
                        "type": "range"
                    },
                    {
                        "content": "76 Sandfield Road, Oxford",
                        "start": "1953-03-30",
                        "end": "1968-06-01",
                        "type": "range"
                    },
                    {
                        "content": "19 Lakeside Road, Poole",
                        "start": "1968-06-01",
                        "end": "1972-03-13",
                        "type": "range"
                    },
                    {
                        "content": "21 Merton Street, Oxford",
                        "start": "1972-03-13",
                        "end": "1973-09-02",
                        "type": "range"
                    }
                ]
            },
            {
                "name": "Occupation",
                "className": "tolkien occupation",
                "hasSubgroups": false,
                "contents": [
                    {
                        "content": "King Edward's School",
                        "start": "1900-01-01",
                        "end": "1901-12-31",
                        "type": "range"
                    },
                    {
                        "content": "St. Phillip's School",
                        "start": "1902-01-01",
                        "end": "1902-11-01",
                        "type": "range"
                    },
                    {
                        "content": "King Edward's School",
                        "start": "1902-11-01",
                        "end": "1911-09-30",
                        "type": "range"
                    },
                    {
                        "content": "Exeter College",
                        "name": "Student",
                        "start": "1911-10-01",
                        "end": "1915-04-01",
                        "type": "range"
                    },
                    {
                        "content": "Army training",
                        "start": "1915-04-01",
                        "end": "1916-06-06",
                        "type": "range"
                    },
                    {
                        "content": "Army service",
                        "start": "1916-06-06",
                        "end": "1916-11-09",
                        "type": "range"
                    },
                    {
                        "content": "Convalescence",
                        "name": "Some garrison duties when able",
                        "start": "1916-11-09",
                        "end": "1919-07-16",
                        "type": "range"
                    },
                    {
                        "content": "O.E.D.",
                        "start": "1919-07-16",
                        "end": "1920-06-30",
                        "type": "range"
                    },
                    {
                        "content": "Leeds University",
                        "name": "Reader in English Language",
                        "start": "1920-10-01",
                        "end": "1925-09-30",
                        "type": "range"
                    },
                    {
                        "content": "Pembroke College",
                        "name": "Rawlinson and Bosworth Professor of Anglo-Saxon",
                        "start": "1925-10-01",
                        "end": "1945-09-30",
                        "type": "range"
                    },
                    {
                        "content": "Merton College",
                        "name": "Merton Professor of English Language and Literature",
                        "start": "1945-10-01",
                        "end": "1959-12-31",
                        "type": "range"
                    },
                    {
                        "content": "Retirement",
                        "start": "1960-01-01",
                        "end": "1973-09-02",
                        "type": "range"
                    }
                ]
            },
            {
                "name": "Life Events",
                "className": "tolkien life",
                "hasSubgroups": false,
                "contents": [
                    {
                        "content": "Birth of J.R.R. Tolkien",
                        "start": "1892-01-03",
                        "type": "point"
                    },
                    {
                        "content": "Death of Arthur Tolkien",
                        "name": "J.R.R. Tolkien's father",
                        "start": "1896-02-15",
                        "type": "point"
                    },
                    {
                        "content": "Marriage of J.R.R. Tolkien & Edith Bratt",
                        "start": "1916-03-22",
                        "type": "point"
                    },
                    {
                        "content": "Tolkiens convert to Catholicism",
                        "start": "1900-06-01",
                        "type": "point"
                    },
                    {
                        "content": "Death of Mabel Tolkien",
                        "name": "J.R.R. Tolkien's mother",
                        "start": "1904-11-01",
                        "type": "point"
                    },
                    {
                        "content": "Tolkien meets Edith",
                        "start": "1908-01-01",
                        "type": "point"
                    },
                    {
                        "content": "Communication with Edith forbidden",
                        "start": "1910-01-21",
                        "type": "point"
                    },
                    {
                        "content": "T.C.B.S. formed",
                        "start": "1911-07-01",
                        "type": "point"
                    },
                    {
                        "content": "Tolkien visits Switzerland",
                        "start": "1911-08-01",
                        "type": "point"
                    },
                    {
                        "content": "Tolkien writes to Edith",
                        "start": "1913-01-03",
                        "type": "point"
                    },
                    {
                        "content": "Tolkien joins army",
                        "name": "Receives commission in Lancashire Fusiliers",
                        "start": "1915-07-15",
                        "type": "point"
                    },
                    {
                        "content": "Final T.C.B.S. meeting",
                        "start": "1915-09-26",
                        "type": "point"
                    },

                    {
                        "content": "Edith dances in glade",
                        "start": "1917-05-01",
                        "type": "point"
                    },
                    {
                        "content": "John Tolkien born",
                        "start": "1917-11-16",
                        "type": "point"
                    },
                    {
                        "content": "Michael Tolkien born",
                        "start": "1920-10-22",
                        "type": "point"
                    },
                    {
                        "content": "Christopher Tolkien born",
                        "start": "1924-11-21",
                        "type": "point"
                    },
                    {
                        "content": "Priscilla Tolkien born",
                        "start": "1929-06-18",
                        "type": "point"
                    },
                    {
                        "content": "Tolkiens' Mediterranean cruise",
                        "start": "1966-09-14",
                        "end": "1966-10-06",
                        "type": "point"
                    },
                    {
                        "content": "Death of Edith Tolkien",
                        "start": "1971-11-29",
                        "type": "point"
                    },
                    {
                        "content": "Tolkien receives CBE",
                        "start": "1972-01-01",
                        "type": "point"
                    }
                ]
            },
            {
                "name": "Major Publications",
                "className": "tolkien major-publications",
                "hasSubgroups": false,
                "contents": [
                    {
                        "content": "The Hobbit",
                        "start": "1937-09-21",
                        "type": "point"
                    },
                    {
                        "content": "Leaf by Niggle",
                        "start": "1945-01-01",
                        "type": "point"
                    },
                    {
                        "content": "On Fairy Stories",
                        "name": "Essays Presented to Charles Williams",
                        "start": "1947-12-04",
                        "type": "point"
                    },
                    {
                        "content": "Farmer Giles of Ham",
                        "start": "1949-10-20",
                        "type": "point"
                    },
                    {
                        "content": "The Fellowship of the Ring",
                        "start": "1954-07-29",
                        "type": "point"
                    },
                    {
                        "content": "The Two Towers",
                        "start": "1954-11-11",
                        "type": "point"
                    },
                    {
                        "content": "The Return of the King",
                        "start": "1955-10-20",
                        "type": "point"
                    },
                    {
                        "content": "Smith of Wooton Major",
                        "start": "1967-11-09",
                        "type": "point"
                    },
                    {
                        "content": "The Silmarillion",
                        "start": "1977-09-15",
                        "type": "point"
                    },
                    {
                        "content": "Unfinished Tales",
                        "start": "1980-10-02",
                        "type": "point"
                    }
                ]
            },
            {
                "name": "Minor Publications",
                "className": "tolkien minor-publications",
                "hasSubgroups": false,
                "contents": [
                    {
                        "content": "Goblin Feet",
                        "name": "Oxford Poetry 1915",
                        "start": "1915-12-01",
                        "type": "point"
                    },
                    {
                        "content": "A Middle English Vocabulary",
                        "start": "1922-05-11",
                        "type": "point"
                    },
                    {
                        "content": "Sir Gawain and the Green Knight",
                        "name": "with E.V. Gordon (Clarendon Press)",
                        "start": "1925-04-23",
                        "type": "point"
                    },
                    {
                        "content": "Errantry",
                        "name": "The Oxford Magazine",
                        "start": "1933-11-09",
                        "type": "point"
                    },
                    {
                        "content": "Beowulf: The Monsters and the Critics",
                        "start": "1937-07-01",
                        "type": "point"
                    },
                    {
                        "content": "The Homecoming of Beorhtnoth Beorhthelm's Son",
                        "start": "1953-10-01",
                        "type": "point"
                    },
                    {
                        "content": "Sir Gawain and the Green Knight broadcast on BBC Radio",
                        "start": "1953-12-06",
                        "type": "point"
                    },
                    {
                        "content": "The Adventures of Tom Bombadil",
                        "start": "1962-11-22",
                        "type": "point"
                    },
                    {
                        "content": "English and Welsh",
                        "start": "1963-07-08",
                        "type": "point"
                    },
                    {
                        "content": "Tree and Leaf",
                        "start": "1964-05-28",
                        "type": "point"
                    },
                    {
                        "content": "Ace Books LOTR",
                        "name": "unauthorized",
                        "start": "1965-07-01",
                        "type": "point"
                    },
                    {
                        "content": "Ballantine Books LOTR",
                        "start": "1965-12-01",
                        "type": "point"
                    },
                    {
                        "content": "The Jerusalem Bible",
                        "name": "Jonah by Tolkien",
                        "start": "1966-01-01",
                        "type": "point"
                    },
                    {
                        "content": "LOTR 2ed.",
                        "start": "1966-10-27",
                        "type": "point"
                    },
                    {
                        "content": "The Road Goes Ever On",
                        "start": "1967-10-31",
                        "type": "point"
                    },
                    {
                        "content": "Father Christmas Letters",
                        "start": "1976-09-02",
                        "type": "point"
                    },
                    {
                        "content": "J.R.R. Tolkien: A Biography",
                        "name": "Carpenter",
                        "start": "1977-05-05",
                        "type": "point"
                    }
                ]
            }
        ]
    },

    {
        "name": "Lewis",
        "className": "group lewis",
        "hasSubgroups": true,
        "contents": [
            {
                "name": "Location",
                "className": "lewis location",
                "hasSubgroups": false,
                "contents": [
                    {
                        "content": "Belfast",
                        "name": "Dundela Villas, near Holywood Road in East Belfast",
                        "start": "1898-11-29",
                        "end": "1905-03-31",
                        "type": "range"
                    },
                    {
                        "content": "Little Lea",
                        "name": "76 Circular Road, Belfast, Northern Ireland",
                        "start": "1905-04-01",
                        "end": "1908-09-14",
                        "type": "range"
                    },
                    {
                        "content": "Watford",
                        "name": "Hertfordshire",
                        "start": "1908-09-15",
                        "end": "1910-06-30",
                        "type": "range"
                    },
                    {
                        "content": "Little Lea",
                        "start": "1910-07-01",
                        "end": "1911-01-14",
                        "type": "range"
                    },
                    {
                        "content": "Malvern, England",
                        "start": "1911-01-15",
                        "end": "1914-09-14",
                        "type": "range"
                    },
                    {
                        "content": "Great Bookham",
                        "name": "Surrey",
                        "start": "1914-09-15",
                        "end": "1917-04-25",
                        "type": "range"
                    },
                    {
                        "content": "Oxford",
                        "start": "1917-04-26",
                        "end": "1917-10-31",
                        "type": "range"
                    },
                    {
                        "content": "France",
                        "start": "1917-11-01",
                        "end": "1918-10-31",
                        "type": "range"
                    },
                    {
                        "content": "Oxford",
                        "start": "1919-01-01",
                        "end": "1930-10-31",
                        "type": "range"
                    },
                    {
                        "content": "The Kilns",
                        "start": "1930-11-01",
                        "end": "1954-12-31",
                        "type": "range"
                    },
                    {
                        "content": "The Kilns and Cambridge",
                        "name": "Cambridge for academic duties and writing, the Kilns for weekends and holidays",
                        "start": "1955-01-01",
                        "end": "1963-11-22",
                        "type": "range"
                    }
                ]
            },
            {
                "name": "Occupation",
                "className": "lewis occupation",
                "hasSubgroups": false,
                "contents": [
                    {
                        "content": "Wynyard School",
                        "start": "1908-09-15",
                        "end": "1910-06-30",
                        "type": "range"
                    },
                    {
                        "content": "Campbell College",
                        "start": "1910-09-01",
                        "end": "1910-11-30",
                        "type": "range"
                    },
                    {
                        "content": "Cherbourg House",
                        "start": "1911-01-15",
                        "end": "1913-09-14",
                        "type": "range"
                    },
                    {
                        "content": "Malvern College",
                        "start": "1913-09-15",
                        "end": "1914-09-14",
                        "type": "range"
                    },
                    {
                        "content": "Kirkpatrick",
                        "name": "private study with William T. Kirkpatrick, \"The Great Knock\"",
                        "start": "1914-09-15",
                        "end": "1917-04-25",
                        "type": "range"
                    },
                    {
                        "content": "University College",
                        "name": "Student",
                        "start": "1917-04-26",
                        "end": "1917-09-14",
                        "type": "range"
                    },
                    {
                        "content": "Army",
                        "start": "1917-09-15",
                        "end": "1919-01-31",
                        "type": "range"
                    },
                    {
                        "content": "University College",
                        "name": "Student: Honour Moderations, Greats, English",
                        "start": "1919-02-01",
                        "end": "1924-06-30",
                        "type": "range"
                    },
                    {
                        "content": "University College",
                        "name": "Philosophy Tutor",
                        "start": "1924-10-01",
                        "end": "1925-05-19",
                        "type": "range"
                    },
                    {
                        "content": "Magdalen College, Oxford",
                        "name": "Fellow and Tutor in English",
                        "start": "1925-05-20",
                        "end": "1954-06-30",
                        "type": "range"
                    },
                    {
                        "content": "Magdalene College, Cambridge",
                        "name": "Professor of Medieval and Renaissance Literature",
                        "start": "1954-07-01",
                        "end": "1963-11-22",
                        "type": "range"
                    }
                ]
            },
            {
                "name": "Life Events",
                "className": "lewis life",
                "hasSubgroups": false,
                "contents": [
                    {
                        "content": "Birth of C.S. Lewis",
                        "start": "1898-11-29",
                        "type": "point"
                    },
                    {
                        "content": "Death of Mabel Lewis",
                        "name": "C.S. Lewis's mother",
                        "start": "1908-08-23",
                        "type": "point"
                    },
                    {
                        "content": "Lewis has lung troubles",
                        "start": "1910-11-01",
                        "type": "point"
                    },
                    {
                        "content": "Lewis meets Arthur Greeves",
                        "start": "1914-04-01",
                        "type": "point"
                    },
                    {
                        "content": "Lewis joins army",
                        "name": "Receives commission as an officer in the 3rd Battalion, Somerset Light Infantry",
                        "start": "1917-09-25",
                        "type": "point"
                    },
                    {
                        "content": "Lewis injured",
                        "name": "Mount Berenchon, Battle of Arras",
                        "start": "1918-04-15",
                        "type": "point"
                    },
                    {
                        "content": "Lewis learns of “Paddy” Moore's death",
                        "start": "1918-05-01",
                        "type": "point"
                    },
                    {
                        "content": "Lewis discharged",
                        "start": "1919-12-01",
                        "type": "point"
                    },
                    {
                        "content": "Lewis moves in with Moores",
                        "start": "1921-06-01",
                        "type": "point"
                    },
                    {
                        "content": "Lewis becomes theist",
                        "name": "\"Most reluctant convert.\" He reports the date to be Trinity Term 1929, but most scholars believe he is off by a year.",
                        "start": "1930-06-01",
                        "type": "point"
                    },
                    {
                        "content": "Lewis becomes Christian",
                        "start": "1931-09-28",
                        "type": "point"
                    },
                    {
                        "content": "Death of Mrs. Moore",
                        "start": "1951-01-12",
                        "type": "point"
                    },
                    {
                        "content": "Lewis loses election for Professor of Poetry",
                        "start": "1951-05-01",
                        "type": "point"
                    },
                    {
                        "content": "Lewis declines O.B.E.",
                        "start": "1951-12-01",
                        "type": "point"
                    },
                    {
                        "content": "Lewis meets Joy Gresham",
                        "start": "1952-09-01",
                        "type": "point"
                    },
                    {
                        "content": "Marriage of C.S. Lewis and Joy Davidman",
                        "name": "Civil marriage at Oxford Registry Office",
                        "start": "1956-04-23",
                        "type": "point"
                    },
                    {
                        "content": "Joy diagnosed with cancer",
                        "start": "1956-10-01",
                        "type": "point"
                    },
                    {
                        "content": "Lewis & Joy's Anglican marriage",
                        "name": "Wingfield Hospital, because of Joy's suspected imminent death",
                        "start": "1956-12-01",
                        "type": "point"
                    },
                    {
                        "content": "Death of Joy Davidman",
                        "start": "1960-07-13",
                        "type": "point"
                    },
                    {
                        "content": "Death of C.S. Lewis",
                        "start": "1963-11-22",
                        "type": "point"
                    }
                ]
            },
            {
                "name": "Major Publications",
                "className": "lewis major-publications",
                "hasSubgroups": false,
                "contents": [
                    {
                        "content": "Out of the Silent Planet",
                        "start": "1938-04-01",
                        "type": "point"
                    },
                    {
                        "content": "The Problem of Pain",
                        "start": "1940-10-01",
                        "type": "point"
                    },
                    {
                        "content": "The Screwtape Letters",
                        "name": "May to November as a weekly serial in The Guardian",
                        "start": "1941-05-01",
                        "type": "point"
                    },
                    {
                        "content": "Broadcast Talks",
                        "name": "1st part of Mere Christianity",
                        "start": "1942-07-01",
                        "type": "point"
                    },
                    {
                        "content": "Christian Behavior",
                        "name": "2nd part of Mere Christianity",
                        "start": "1943-03-01",
                        "type": "point"
                    },
                    {
                        "content": "Perelandra",
                        "start": "1943-04-20",
                        "type": "point"
                    },
                    {
                        "content": "The Abolition of Man",
                        "start": "1943-07-02",
                        "type": "point"
                    },
                    {
                        "content": "Beyond Personality",
                        "name": "3rd part of Mere Christianity",
                        "start": "1944-01-01",
                        "type": "point"
                    },
                    {
                        "content": "That Hideous Strength",
                        "start": "1945-08-16",
                        "type": "point"
                    },
                    {
                        "content": "The Great Divorce",
                        "name": "published in serial form in 1944",
                        "start": "1945-07-02",
                        "type": "point"
                    },
                    {
                        "content": "Miracles",
                        "start": "1947-07-02",
                        "type": "point"
                    },
                    {
                        "content": "The Lion, the Witch, and the Wardrobe",
                        "start": "1950-10-16",
                        "type": "point"
                    },
                    {
                        "content": "Prince Caspian",
                        "start": "1951-10-15",
                        "type": "point"
                    },
                    {
                        "content": "The Voyage of the Dawn Treader",
                        "start": "1952-09-15",
                        "type": "point"
                    },
                    {
                        "content": "The Silver Chair",
                        "start": "1953-09-07",
                        "type": "point"
                    },
                    {
                        "content": "The Horse and His Boy",
                        "start": "1954-09-06",
                        "type": "point"
                    },
                    {
                        "content": "Surprised by Joy",
                        "start": "1955-01-01",
                        "type": "point"
                    },
                    {
                        "content": "The Magicians Nephew",
                        "start": "1955-05-02",
                        "type": "point"
                    },
                    {
                        "content": "Till We Have Faces",
                        "start": "1956-01-01",
                        "type": "point"
                    },
                    {
                        "content": "The Last Battle",
                        "start": "1956-09-04",
                        "type": "point"
                    },
                    {
                        "content": "The Four Loves",
                        "start": "1960-07-02",
                        "type": "point"
                    },
                    {
                        "content": "A Grief Observed",
                        "start": "1961-01-03",
                        "type": "point"
                    },
                    {
                        "content": "The Discarded Image",
                        "name": "Posthumous",
                        "start": "1964-01-01",
                        "type": "point"
                    }
                ]
            },
            {
                "name": "Minor Publications",
                "className": "lewis minor-publications",
                "hasSubgroups": false,
                "contents": [
                    {
                        "content": "The Pilgrim's Regress",
                        "name": "J.M. Dent, published under Clive Hamliton",
                        "start": "1933-05-01",
                        "type": "point"
                    },
                    {
                        "content": "The Allegory of Love",
                        "name": "Clarendon Press",
                        "start": "1936-05-21",
                        "type": "point"
                    },
                    {
                        "content": "Spirits in Bondage: A Cycle of Lyrics",
                        "name": "Heinemann, published under Clive Hamilton",
                        "start": "1919-03-20",
                        "type": "point"
                    },
                    {
                        "content": "Dymer",
                        "name": "J.M. Dent, published under Clive Hamilton",
                        "start": "1926-09-18",
                        "type": "point"
                    },
                    {
                        "content": "The Screwtape Letters",
                        "name": "book",
                        "start": "1942-02-09",
                        "type": "point"
                    },
                    {
                        "content": "A Preface to Paradise Lost",
                        "start": "1942-07-02",
                        "type": "point"
                    },
                    {
                        "content": "Essays Presented to Charles Williams",
                        "start": "1947-12-04",
                        "type": "point"
                    },
                    {
                        "content": "Arthurian Torso",
                        "start": "1948-07-02",
                        "type": "point"
                    },
                    {
                        "content": "Transposition and Other Addresses",
                        "start": "1949-07-02",
                        "type": "point"
                    },
                    {
                        "content": "Mere Christianity",
                        "name": "Compiling Broadcast Talks, Christian Behavior, and Beyond Personality into a single book",
                        "start": "1952-07-07",
                        "type": "point"
                    },
                    {
                        "content": "English Literature in the 16th Century, Excluding Drama",
                        "name": "Oxford History of English Literature",
                        "start": "1954-09-16",
                        "type": "point"
                    },
                    {
                        "content": "Reflections on the Psalms",
                        "start": "1958-07-02",
                        "type": "point"
                    },
                    {
                        "content": "Screwtape Proposes a Toast",
                        "start": "1959-12-19",
                        "type": "point"
                    },
                    {
                        "content": "Studies in Words",
                        "start": "1960-09-09",
                        "type": "point"
                    },
                    {
                        "content": "Letters to Malcom: Chiefly on Prayer",
                        "name": "Posthumous",
                        "start": "1964-01-01",
                        "type": "point"
                    }
                ]
            }
        ]
    },
    {
        "name": "Inklings",
        "className": "inklings",
        "hasSubgroups": false,
        "contents": [
            {
                "content": "Lewis & Barfield's Great War",
                "start": "1922-01-01",
                "end": "1931-12-31",
                "type": "range"
            },
            {
                "content": "Lewis and Tolkien meet",
                "start": "1926-05-11",
                "type": "point"
            }
        ]
    }
]