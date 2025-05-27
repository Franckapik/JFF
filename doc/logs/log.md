// PlayerStore
{
  "selectedVehicle": {
    "playerId": "player1",
    "vehicleId": "ship"
  },
  "movementSpeeds": {
    "ship": {
      "speed": 2,
      "rotationSpeed": 2
    },
    "drone": {
      "speed": 3,
      "rotationSpeed": 2.5
    }
  },
  "players": {
    "player1": {
      "id": "player1",
      "exploringRadius": 3,
      "vehicles": {
        "undefined-ship": {
          "id": "undefined-ship",
          "type": "ship",
          "position": null,
          "coord": null,
          "isMoving": false,
          "progress": 0,
          "resources": {
            "food": 0,
            "debris": 0,
            "special": 0
          },
          "targetTile": {
            "position": null,
            "coord": null
          },
          "fuel": 100,
          "damage": 0,
          "totalDistance": 0,
          "path": [],
          "startCoord": null,
          "isAtCapacity": false,
          "maxCapacity": {
            "food": 100,
            "debris": 1000,
            "special": 2
          }
        },
        "player1-drone-explorer_drone": {
          "id": "player1-drone-explorer_drone",
          "type": "explorer_drone",
          "position": null,
          "coord": null,
          "isMoving": false,
          "progress": 0,
          "resources": {
            "food": 0,
            "debris": 0,
            "special": 0
          },
          "targetTile": {
            "position": null,
            "coord": null
          }
        },
        "player1-drone-combat_drone": {
          "id": "player1-drone-combat_drone",
          "type": "combat_drone",
          "position": null,
          "coord": null,
          "isMoving": false,
          "progress": 0,
          "resources": {
            "food": 0,
            "debris": 0,
            "special": 0
          },
          "targetTile": {
            "position": null,
            "coord": null
          }
        },
        "player1-drone-special_drone": {
          "id": "player1-drone-special_drone",
          "type": "special_drone",
          "position": null,
          "coord": null,
          "isMoving": false,
          "progress": 0,
          "resources": {
            "food": 0,
            "debris": 0,
            "special": 0
          },
          "targetTile": {
            "position": null,
            "coord": null
          }
        },
        "ship": {
          "position": {
            "x": -1.8,
            "y": 0,
            "z": 0
          },
          "coord": "C3",
          "startCoord": "C3"
        }
      },
      "score": {
        "resources": {
          "food": 0,
          "debris": 0,
          "special": 0
        }
      },
      "memory": {
        "knownResources": [],
        "knownDangers": [],
        "explorationCount": 0,
        "collectedResources": []
      },
      "messages": []
    },
    "bot-0": {
      "id": "bot-0",
      "exploringRadius": 3,
      "vehicles": {
        "undefined-ship": {
          "id": "undefined-ship",
          "type": "ship",
          "position": null,
          "coord": null,
          "isMoving": false,
          "progress": 0,
          "resources": {
            "food": 0,
            "debris": 0,
            "special": 0
          },
          "targetTile": {
            "position": null,
            "coord": null
          },
          "fuel": 100,
          "damage": 0,
          "totalDistance": 0,
          "path": [],
          "startCoord": null,
          "isAtCapacity": false,
          "maxCapacity": {
            "food": 100,
            "debris": 1000,
            "special": 2
          }
        },
        "bot-0-drone-explorer_drone": {
          "id": "bot-0-drone-explorer_drone",
          "type": "explorer_drone",
          "position": null,
          "coord": null,
          "isMoving": false,
          "progress": 0,
          "resources": {
            "food": 0,
            "debris": 0,
            "special": 0
          },
          "targetTile": {
            "position": null,
            "coord": null
          },
          "isActive": true,
          "fuel": 50,
          "damage": 0,
          "maxCapacity": {
            "food": 0,
            "debris": 0,
            "special": 0
          },
          "explorationBonus": 1.5
        },
        "bot-0-drone-combat_drone": {
          "id": "bot-0-drone-combat_drone",
          "type": "combat_drone",
          "position": null,
          "coord": null,
          "isMoving": false,
          "progress": 0,
          "resources": {
            "food": 0,
            "debris": 0,
            "special": 0
          },
          "targetTile": {
            "position": null,
            "coord": null
          },
          "isActive": false,
          "fuel": 50,
          "damage": 5,
          "maxCapacity": {
            "food": 20,
            "debris": 50,
            "special": 1
          },
          "attackRange": 2,
          "mineLayingCapacity": 3
        },
        "bot-0-drone-special_drone": {
          "id": "bot-0-drone-special_drone",
          "type": "special_drone",
          "position": null,
          "coord": null,
          "isMoving": false,
          "progress": 0,
          "resources": {
            "food": 0,
            "debris": 0,
            "special": 0
          },
          "targetTile": {
            "position": null,
            "coord": null
          },
          "isActive": false,
          "fuel": 50,
          "damage": 0,
          "maxCapacity": {
            "food": 0,
            "debris": 0,
            "special": 0
          },
          "specialScanRange": 5,
          "specialDetection": true,
          "specialAbilityCharge": 100
        },
        "ship": {
          "position": {
            "x": -0.9,
            "y": 0,
            "z": -1.5588457268119895
          },
          "coord": "D2",
          "startCoord": "D2"
        }
      },
      "score": {
        "resources": {
          "food": 0,
          "debris": 0,
          "special": 0
        }
      },
      "memory": {
        "knownResources": [],
        "knownDangers": [],
        "explorationCount": 0,
        "collectedResources": [],
        "transitionState": null
      },
      "messages": []
    }
  }
}