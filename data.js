const rawData = [
    {
        "name": "Tolkien",
        "type": "superGroup",
        "tags": ["tolkien"],
        "contents": [
            {
                "name": "Location",
                "type": "subGroup",
                "tags": ["tolkien", "location"],
                "contents": [
                    {
                        "name": "Bloemfontein, South Africa",
                        "start": "1892-01-01",
                        "end": "1895-12-31",
                        "type": "range"
                    },
                    {
                        "name": "Birmingham and suburbs",
                        "start": "1896-01-01",
                        "end": "1911-09-30"
                    },
                    {
                        "name": "Oxford",
                        "start": "1911-10-01",
                        "end": "1915-04-01",
                        "type": "range"
                    },
                    {
                        "name": "Army",
                        "description": "Mostly training around Bedford and Staffordshire",
                        "start": "1915-04-01",
                        "end": "1916-11-08",
                        "type": "range"
                    },
                    {
                        "name": "France",
                        "start": "1916-06-06",
                        "type": "point"
                    },
                    {
                        "name": "Recovery",
                        "description": "Great Haywood, various camps and hospitals",
                        "start": "1916-11-09",
                        "end": "1918-10-31",
                        "type": "range"
                    },
                    {
                        "name": "Oxford",
                        "start": "1918-11-01",
                        "end": "1920-09-01",
                        "type": "range"
                    },
                    {
                        "name": "Leeds",
                        "start": "1920-09-01",
                        "end": "1926-01-07",
                        "type": "range"
                    },
                    {
                        "name": "5 Holly Bank",
                        "start": "1921-03-01",
                        "end": "1921-08-01",
                        "type": "range"
                    },
                    {
                        "name": "11 St Marks Terrace",
                        "start": "1921-08-01",
                        "end": "1924-03-17",
                        "type": "range"
                    },
                    {
                        "name": "2 Darnley Road",
                        "start": "1924-03-17",
                        "end": "1926-01-07",
                        "type": "range"
                    },
                    {
                        "name": "22 Northmoor Road, Oxford",
                        "start": "1926-01-07",
                        "end": "1930-01-14",
                        "type": "range"
                    },
                    {
                        "name": "20 Northmoor Road, Oxford",
                        "start": "1930-01-14",
                        "end": "1947-03-01",
                        "type": "range"
                    },
                    {
                        "name": "3 Manor Road, Oxford",
                        "start": "1947-03-01",
                        "end": "1953-03-30",
                        "type": "range"
                    },
                    {
                        "name": "76 Sandfield Road, Oxford",
                        "start": "1953-03-30",
                        "end": "1968-06-01",
                        "type": "range"
                    },
                    {
                        "name": "19 Lakeside Road, Poole",
                        "start": "1968-06-01",
                        "end": "1972-03-13",
                        "type": "range"
                    },
                    {
                        "name": "21 Merton Street, Oxford",
                        "start": "1972-03-13",
                        "end": "1973-09-02",
                        "type": "range"
                    }
                ]
            },
            {
                "name": "Occupation",
                "type": "subGroup",
                "tags": ["tolkien", "occupation"],
                "contents": [
                    {
                        "name": "King Edward's School",
                        "start": "1900-01-01",
                        "end": "1901-12-31",
                        "type": "range"
                    },
                    {
                        "name": "St. Phillip's School",
                        "start": "1902-01-01",
                        "end": "1902-11-01",
                        "type": "range"
                    },
                    {
                        "name": "King Edward's School",
                        "start": "1902-11-01",
                        "end": "1911-09-30",
                        "type": "range"
                    },
                    {
                        "name": "Exeter College",
                        "description": "Student",
                        "start": "1911-10-01",
                        "end": "1915-04-01",
                        "type": "range"
                    },
                    {
                        "name": "Army training",
                        "start": "1915-04-01",
                        "end": "1916-06-06",
                        "type": "range"
                    },
                    {
                        "name": "Army service",
                        "start": "1916-06-06",
                        "end": "1916-11-09",
                        "type": "range"
                    },
                    {
                        "name": "Convalescence",
                        "description": "Some garrison duties when able",
                        "start": "1916-11-09",
                        "end": "1919-07-16",
                        "type": "range"
                    },
                    {
                        "name": "O.E.D.",
                        "start": "1919-07-16",
                        "end": "1920-06-30",
                        "type": "range"
                    },
                    {
                        "name": "Leeds University",
                        "description": "Reader in English Language",
                        "start": "1920-10-01",
                        "end": "1925-09-30",
                        "type": "range"
                    },
                    {
                        "name": "Pembroke College",
                        "description": "Rawlinson and Bosworth Professor of Anglo-Saxon",
                        "start": "1925-10-01",
                        "end": "1945-09-30",
                        "type": "range"
                    },
                    {
                        "name": "Merton College",
                        "description": "Merton Professor of English Language and Literature",
                        "start": "1945-10-01",
                        "end": "1959-12-31",
                        "type": "range"
                    },
                    {
                        "name": "Retirement",
                        "start": "1960-01-01",
                        "end": "1973-09-02",
                        "type": "range"
                    }
                ]
            },
            {
                "name": "Life Events",
                "type": "subGroup",
                "tags": ["tolkien", "life"],
                "contents": [
                    {
                        "name": "Birth of J.R.R. Tolkien",
                        "start": "1892-01-03",
                        "type": "point"
                    },
                    {
                        "name": "Death of Arthur Tolkien",
                        "description": "J.R.R. Tolkien's father",
                        "start": "1896-02-15",
                        "type": "point"
                    },
                    {
                        "name": "Marriage of J.R.R. Tolkien & Edith Bratt",
                        "start": "1916-03-22",
                        "type": "point"
                    },
                    {
                        "name": "Tolkiens convert to Catholicism",
                        "start": "1900-06-01",
                        "type": "point"
                    },
                    {
                        "name": "Death of Mabel Tolkien",
                        "description": "J.R.R. Tolkien's mother",
                        "start": "1904-11-01",
                        "type": "point"
                    },
                    {
                        "name": "Tolkien meets Edith",
                        "start": "1908-01-01",
                        "type": "point"
                    },
                    {
                        "name": "Communication with Edith forbidden",
                        "start": "1910-01-21",
                        "type": "point"
                    },
                    {
                        "name": "T.C.B.S. formed",
                        "start": "1911-07-01",
                        "type": "point"
                    },
                    {
                        "name": "Tolkien visits Switzerland",
                        "start": "1911-08-01",
                        "type": "point"
                    },
                    {
                        "name": "Tolkien writes to Edith",
                        "start": "1913-01-03",
                        "type": "point"
                    },
                    {
                        "name": "Tolkien joins army",
                        "description": "Receives commission in Lancashire Fusiliers",
                        "start": "1915-07-15",
                        "type": "point"
                    },
                    {
                        "name": "Final T.C.B.S. meeting",
                        "start": "1915-09-26",
                        "type": "point"
                    },
                    {
                        "name": "Edith dances in glade",
                        "start": "1917-05-01",
                        "type": "point"
                    },
                    {
                        "name": "John Tolkien born",
                        "start": "1917-11-16",
                        "type": "point"
                    },
                    {
                        "name": "Michael Tolkien born",
                        "start": "1920-10-22",
                        "type": "point"
                    },
                    {
                        "name": "Christopher Tolkien born",
                        "start": "1924-11-21",
                        "type": "point"
                    },
                    {
                        "name": "Priscilla Tolkien born",
                        "start": "1929-06-18",
                        "type": "point"
                    },
                    {
                        "name": "Tolkiens' Mediterranean cruise",
                        "start": "1966-09-14",
                        "end": "1966-10-06",
                        "type": "point"
                    },
                    {
                        "name": "Death of Edith Tolkien",
                        "start": "1971-11-29",
                        "type": "point"
                    },
                    {
                        "name": "Tolkien receives CBE",
                        "start": "1972-01-01",
                        "type": "point"
                    }
                ]
            },
            {
                "name": "Major Publications",
                "type": "subGroup",
                "tags": ["tolkien", "major-publications"],
                "contents": [
                    {
                        "name": "The Hobbit",
                        "start": "1937-09-21",
                        "type": "point"
                    },
                    {
                        "name": "Leaf by Niggle",
                        "start": "1945-01-01",
                        "type": "point"
                    },
                    {
                        "name": "On Fairy Stories",
                        "description": "Essays Presented to Charles Williams",
                        "start": "1947-12-04",
                        "type": "point"
                    },
                    {
                        "name": "Farmer Giles of Ham",
                        "start": "1949-10-20",
                        "type": "point"
                    },
                    {
                        "name": "The Fellowship of the Ring",
                        "start": "1954-07-29",
                        "type": "point"
                    },
                    {
                        "name": "The Two Towers",
                        "start": "1954-11-11",
                        "type": "point"
                    },
                    {
                        "name": "The Return of the King",
                        "start": "1955-10-20",
                        "type": "point"
                    },
                    {
                        "name": "Smith of Wooton Major",
                        "start": "1967-11-09",
                        "type": "point"
                    },
                    {
                        "name": "The Silmarillion",
                        "start": "1977-09-15",
                        "type": "point"
                    },
                    {
                        "name": "Unfinished Tales",
                        "start": "1980-10-02",
                        "type": "point"
                    }
                ]
            },
            {
                "name": "Minor Publications",
                "type": "subGroup",
                "tags": ["tolkien", "minor-publications"],
                "contents": [
                    {
                        "name": "Goblin Feet",
                        "description": "Oxford Poetry 1915",
                        "start": "1915-12-01",
                        "type": "point"
                    },
                    {
                        "name": "A Middle English Vocabulary",
                        "start": "1922-05-11",
                        "type": "point"
                    },
                    {
                        "name": "Sir Gawain and the Green Knight",
                        "description": "with E.V. Gordon (Clarendon Press)",
                        "start": "1925-04-23",
                        "type": "point"
                    },
                    {
                        "name": "Errantry",
                        "description": "The Oxford Magazine",
                        "start": "1933-11-09",
                        "type": "point"
                    },
                    {
                        "name": "Beowulf: The Monsters and the Critics",
                        "start": "1937-07-01",
                        "type": "point"
                    },
                    {
                        "name": "The Homecoming of Beorhtnoth Beorhthelm's Son",
                        "start": "1953-10-01",
                        "type": "point"
                    },
                    {
                        "name": "Sir Gawain and the Green Knight broadcast on BBC Radio",
                        "start": "1953-12-06",
                        "type": "point"
                    },
                    {
                        "name": "The Adventures of Tom Bombadil",
                        "start": "1962-11-22",
                        "type": "point"
                    },
                    {
                        "name": "English and Welsh",
                        "start": "1963-07-08",
                        "type": "point"
                    },
                    {
                        "name": "Tree and Leaf",
                        "start": "1964-05-28",
                        "type": "point"
                    },
                    {
                        "name": "Ace Books LOTR",
                        "description": "unauthorized",
                        "start": "1965-07-01",
                        "type": "point"
                    },
                    {
                        "name": "Ballantine Books LOTR",
                        "start": "1965-12-01",
                        "type": "point"
                    },
                    {
                        "name": "The Jerusalem Bible",
                        "description": "Jonah by Tolkien",
                        "start": "1966-01-01",
                        "type": "point"
                    },
                    {
                        "name": "LOTR 2ed.",
                        "start": "1966-10-27",
                        "type": "point"
                    },
                    {
                        "name": "The Road Goes Ever On",
                        "start": "1967-10-31",
                        "type": "point"
                    },
                    {
                        "name": "Father Christmas Letters",
                        "start": "1976-09-02",
                        "type": "point"
                    },
                    {
                        "name": "J.R.R. Tolkien: A Biography",
                        "description": "Carpenter",
                        "start": "1977-05-05",
                        "type": "point"
                    }
                ]
            }
        ]
    },
    {
        "name": "Lewis",
        "type": "superGroup",
        "tags": ["lewis"],
        "contents": [
            {
                "name": "Location",
                "type": "subGroup",
                "tags": ["lewis", "location"],
                "contents": [
                    {
                        "name": "Belfast",
                        "description": "Dundela Villas, near Holywood Road in East Belfast",
                        "start": "1898-11-29",
                        "end": "1905-03-31",
                        "type": "range"
                    },
                    {
                        "name": "Little Lea",
                        "description": "76 Circular Road, Belfast, Northern Ireland",
                        "start": "1905-04-01",
                        "end": "1908-09-14",
                        "type": "range"
                    },
                    {
                        "name": "Watford",
                        "description": "Hertfordshire",
                        "start": "1908-09-15",
                        "end": "1910-06-30",
                        "type": "range"
                    },
                    {
                        "name": "Little Lea",
                        "start": "1910-07-01",
                        "end": "1911-01-14",
                        "type": "range"
                    },
                    {
                        "name": "Malvern, England",
                        "start": "1911-01-15",
                        "end": "1914-09-14",
                        "type": "range"
                    },
                    {
                        "name": "Great Bookham",
                        "description": "Surrey",
                        "start": "1914-09-15",
                        "end": "1917-04-25",
                        "type": "range"
                    },
                    {
                        "name": "Oxford",
                        "start": "1917-04-26",
                        "end": "1917-10-31",
                        "type": "range"
                    },
                    {
                        "name": "France",
                        "start": "1917-11-01",
                        "end": "1918-10-31",
                        "type": "range"
                    },
                    {
                        "name": "Oxford",
                        "start": "1919-01-01",
                        "end": "1930-10-31",
                        "type": "range"
                    },
                    {
                        "name": "The Kilns",
                        "start": "1930-11-01",
                        "end": "1954-12-31",
                        "type": "range"
                    },
                    {
                        "name": "The Kilns and Cambridge",
                        "description": "Cambridge for academic duties and writing, the Kilns for weekends and holidays",
                        "start": "1955-01-01",
                        "end": "1963-11-22",
                        "type": "range"
                    }
                ]
            },
            {
                "name": "Occupation",
                "type": "subGroup",
                "tags": ["lewis", "occupation"],
                "contents": [
                    {
                        "name": "Wynyard School",
                        "start": "1908-09-15",
                        "end": "1910-06-30",
                        "type": "range"
                    },
                    {
                        "name": "Campbell College",
                        "start": "1910-09-01",
                        "end": "1910-11-30",
                        "type": "range"
                    },
                    {
                        "name": "Cherbourg House",
                        "start": "1911-01-15",
                        "end": "1913-09-14",
                        "type": "range"
                    },
                    {
                        "name": "Malvern College",
                        "start": "1913-09-15",
                        "end": "1914-09-14",
                        "type": "range"
                    },
                    {
                        "name": "Kirkpatrick",
                        "description": "private study with William T. Kirkpatrick, \"The Great Knock\"",
                        "start": "1914-09-15",
                        "end": "1917-04-25",
                        "type": "range"
                    },
                    {
                        "name": "University College",
                        "description": "Student",
                        "start": "1917-04-26",
                        "end": "1917-09-14",
                        "type": "range"
                    },
                    {
                        "name": "Army",
                        "start": "1917-09-15",
                        "end": "1919-01-31",
                        "type": "range"
                    },
                    {
                        "name": "University College",
                        "description": "Student: Honour Moderations, Greats, English",
                        "start": "1919-02-01",
                        "end": "1924-06-30",
                        "type": "range"
                    },
                    {
                        "name": "University College",
                        "description": "Philosophy Tutor",
                        "start": "1924-10-01",
                        "end": "1925-05-19",
                        "type": "range"
                    },
                    {
                        "name": "Magdalen College, Oxford",
                        "description": "Fellow and Tutor in English",
                        "start": "1925-05-20",
                        "end": "1954-06-30",
                        "type": "range"
                    },
                    {
                        "name": "Magdalene College, Cambridge",
                        "description": "Professor of Medieval and Renaissance Literature",
                        "start": "1954-07-01",
                        "end": "1963-11-22",
                        "type": "range"
                    }
                ]
            },
            {
                "name": "Life Events",
                "type": "subGroup",
                "tags": ["lewis", "life"],
                "contents": [
                    {
                        "name": "Birth of C.S. Lewis",
                        "start": "1898-11-29",
                        "type": "point"
                    },
                    {
                        "name": "Death of Mabel Lewis",
                        "description": "C.S. Lewis's mother",
                        "start": "1908-08-23",
                        "type": "point"
                    },
                    {
                        "name": "Lewis has lung troubles",
                        "start": "1910-11-01",
                        "type": "point"
                    },
                    {
                        "name": "Lewis meets Arthur Greeves",
                        "start": "1914-04-01",
                        "type": "point"
                    },
                    {
                        "name": "Lewis joins army",
                        "description": "Receives commission as an officer in the 3rd Battalion, Somerset Light Infantry",
                        "start": "1917-09-25",
                        "type": "point"
                    },
                    {
                        "name": "Lewis injured",
                        "description": "Mount Berenchon, Battle of Arras",
                        "start": "1918-04-15",
                        "type": "point"
                    },
                    {
                        "name": "Lewis learns of “Paddy” Moore's death",
                        "start": "1918-05-01",
                        "type": "point"
                    },
                    {
                        "name": "Lewis discharged",
                        "start": "1919-12-01",
                        "type": "point"
                    },
                    {
                        "name": "Lewis moves in with Moores",
                        "start": "1921-06-01",
                        "type": "point"
                    },
                    {
                        "name": "Lewis becomes theist",
                        "description": "\"Most reluctant convert.\" He reports the date to be Trinity Term 1929, but most scholars believe he is off by a year.",
                        "start": "1930-06-01",
                        "type": "point"
                    },
                    {
                        "name": "Lewis becomes Christian",
                        "start": "1931-09-28",
                        "type": "point"
                    },
                    {
                        "name": "Death of Mrs. Moore",
                        "start": "1951-01-12",
                        "type": "point"
                    },
                    {
                        "name": "Lewis loses election for Professor of Poetry",
                        "start": "1951-05-01",
                        "type": "point"
                    },
                    {
                        "name": "Lewis declines O.B.E.",
                        "start": "1951-12-01",
                        "type": "point"
                    },
                    {
                        "name": "Lewis meets Joy Gresham",
                        "start": "1952-09-01",
                        "type": "point"
                    },
                    {
                        "name": "Marriage of C.S. Lewis and Joy Davidman",
                        "description": "Civil marriage at Oxford Registry Office",
                        "start": "1956-04-23",
                        "type": "point"
                    },
                    {
                        "name": "Joy diagnosed with cancer",
                        "start": "1956-10-01",
                        "type": "point"
                    },
                    {
                        "name": "Lewis & Joy's Anglican marriage",
                        "description": "Wingfield Hospital, because of Joy's suspected imminent death",
                        "start": "1956-12-01",
                        "type": "point"
                    },
                    {
                        "name": "Death of Joy Davidman",
                        "start": "1960-07-13",
                        "type": "point"
                    },
                    {
                        "name": "Death of C.S. Lewis",
                        "start": "1963-11-22",
                        "type": "point"
                    }
                ]
            },
            {
                "name": "Major Publications",
                "type": "subGroup",
                "tags": ["lewis", "major-publications"],
                "contents": [
                    {
                        "name": "Out of the Silent Planet",
                        "start": "1938-04-01",
                        "type": "point"
                    },
                    {
                        "name": "The Problem of Pain",
                        "start": "1940-10-01",
                        "type": "point"
                    },
                    {
                        "name": "The Screwtape Letters",
                        "description": "May to November as a weekly serial in The Guardian",
                        "start": "1941-05-01",
                        "type": "point"
                    },
                    {
                        "name": "Broadcast Talks",
                        "description": "1st part of Mere Christianity",
                        "start": "1942-07-01",
                        "type": "point"
                    },
                    {
                        "name": "Christian Behavior",
                        "description": "2nd part of Mere Christianity",
                        "start": "1943-03-01",
                        "type": "point"
                    },
                    {
                        "name": "Perelandra",
                        "start": "1943-04-20",
                        "type": "point"
                    },
                    {
                        "name": "The Abolition of Man",
                        "start": "1943-07-02",
                        "type": "point"
                    },
                    {
                        "name": "Beyond Personality",
                        "description": "3rd part of Mere Christianity",
                        "start": "1944-01-01",
                        "type": "point"
                    },
                    {
                        "name": "That Hideous Strength",
                        "start": "1945-08-16",
                        "type": "point"
                    },
                    {
                        "name": "The Great Divorce",
                        "description": "published in serial form in 1944",
                        "start": "1945-07-02",
                        "type": "point"
                    },
                    {
                        "name": "Miracles",
                        "start": "1947-07-02",
                        "type": "point"
                    },
                    {
                        "name": "The Lion, the Witch, and the Wardrobe",
                        "start": "1950-10-16",
                        "type": "point"
                    },
                    {
                        "name": "Prince Caspian",
                        "start": "1951-10-15",
                        "type": "point"
                    },
                    {
                        "name": "The Voyage of the Dawn Treader",
                        "start": "1952-09-15",
                        "type": "point"
                    },
                    {
                        "name": "The Silver Chair",
                        "start": "1953-09-07",
                        "type": "point"
                    },
                    {
                        "name": "The Horse and His Boy",
                        "start": "1954-09-06",
                        "type": "point"
                    },
                    {
                        "name": "Surprised by Joy",
                        "start": "1955-01-01",
                        "type": "point"
                    },
                    {
                        "name": "The Magicians Nephew",
                        "start": "1955-05-02",
                        "type": "point"
                    },
                    {
                        "name": "Till We Have Faces",
                        "start": "1956-01-01",
                        "type": "point"
                    },
                    {
                        "name": "The Last Battle",
                        "start": "1956-09-04",
                        "type": "point"
                    },
                    {
                        "name": "The Four Loves",
                        "start": "1960-07-02",
                        "type": "point"
                    },
                    {
                        "name": "A Grief Observed",
                        "start": "1961-01-03",
                        "type": "point"
                    },
                    {
                        "name": "The Discarded Image",
                        "description": "Posthumous",
                        "start": "1964-01-01",
                        "type": "point"
                    }
                ]
            },
            {
                "name": "Minor Publications",
                "type": "subGroup",
                "tags": ["lewis", "minor-publications"],
                "contents": [
                    {
                        "name": "The Pilgrim's Regress",
                        "description": "J.M. Dent, published under Clive Hamliton",
                        "start": "1933-05-01",
                        "type": "point"
                    },
                    {
                        "name": "The Allegory of Love",
                        "description": "Clarendon Press",
                        "start": "1936-05-21",
                        "type": "point"
                    },
                    {
                        "name": "Spirits in Bondage: A Cycle of Lyrics",
                        "description": "Heinemann, published under Clive Hamilton",
                        "start": "1919-03-20",
                        "type": "point"
                    },
                    {
                        "name": "Dymer",
                        "description": "J.M. Dent, published under Clive Hamilton",
                        "start": "1926-09-18",
                        "type": "point"
                    },
                    {
                        "name": "The Screwtape Letters",
                        "description": "book",
                        "start": "1942-02-09",
                        "type": "point"
                    },
                    {
                        "name": "A Preface to Paradise Lost",
                        "start": "1942-07-02",
                        "type": "point"
                    },
                    {
                        "name": "Essays Presented to Charles Williams",
                        "start": "1947-12-04",
                        "type": "point"
                    },
                    {
                        "name": "Arthurian Torso",
                        "start": "1948-07-02",
                        "type": "point"
                    },
                    {
                        "name": "Transposition and Other Addresses",
                        "start": "1949-07-02",
                        "type": "point"
                    },
                    {
                        "name": "Mere Christianity",
                        "description": "Compiling Broadcast Talks, Christian Behavior, and Beyond Personality into a single book",
                        "start": "1952-07-07",
                        "type": "point"
                    },
                    {
                        "name": "English Literature in the 16th Century, Excluding Drama",
                        "description": "Oxford History of English Literature",
                        "start": "1954-09-16",
                        "type": "point"
                    },
                    {
                        "name": "Reflections on the Psalms",
                        "start": "1958-07-02",
                        "type": "point"
                    },
                    {
                        "name": "Screwtape Proposes a Toast",
                        "start": "1959-12-19",
                        "type": "point"
                    },
                    {
                        "name": "Studies in Words",
                        "start": "1960-09-09",
                        "type": "point"
                    },
                    {
                        "name": "Letters to Malcom: Chiefly on Prayer",
                        "description": "Posthumous",
                        "start": "1964-01-01",
                        "type": "point"
                    }
                ]
            }
        ]
    },
    {
        "name": "Inklings",
        "type": "subGroup",
        "tags": ["inklings"],
        "contents": [
            {
                "name": "Lewis & Barfield's Great War",
                "start": "1922-01-01",
                "end": "1931-12-31",
                "type": "range"
            },
            {
                "name": "Lewis and Tolkien meet",
                "start": "1926-05-11",
                "type": "point"
            }
        ]
    }
]