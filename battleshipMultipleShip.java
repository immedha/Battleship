// this works and takes into account different types of ships; it returns highest probability of different ships and highest probability overall
import java.util.*;
public class battleshipMultipleShip {
  public static final int SIZE = 5;
  public static final double AMT = 0.04;
  public static double[][] fiveShip;
  public static double[][] fourShip;
  public static double[][] threeShip;
  public static double[][] twoShip;
  public static double max5 = 0;
  public static double max4 = 0;
  public static double max3 = 0;
  public static double max2 = 0;
  public static int[] twoLoc = new int[2];
  public static int[] threeLoc = new int[2];
  public static int[] fourLoc = new int[2];
  public static int[] fiveLoc = new int[2];

  public static void main(String[] args) {
    //1 represents ship found, 2 represents ship sunk, 0 represents not checked, -1 represents no ship
    int[][] aiGuess = {
      {0,0,0,0,0},
      {0,0,0,0,0},
      {0,0,0,0,0},
      {0,0,0,0,0},
      {0,0,0,0,0}
    };
    List<Integer> shipsLeft = new ArrayList<>();
    shipsLeft.add(2);
    shipsLeft.add(3);
    shipsLeft.add(5);
    shipsLeft.add(4);
    shipsLeft.add(3);
    prob(aiGuess, shipsLeft);
  }

  public static void createProbArrays(List<Integer> shipsLeft) {
    for (int num : shipsLeft) {
      if (num == 5) {
        fiveShip = new double[SIZE][SIZE];
      }
      if (num == 4) {
        fourShip = new double[SIZE][SIZE];
      }
      if (num == 3) {
        threeShip = new double[SIZE][SIZE];
      }
      if (num == 2) {
        twoShip = new double[SIZE][SIZE];
      }
    }
  }

  public static void update(List<Integer> shipsLeft, int i, int j) {
    if (shipsLeft.contains(5)) {
      fiveShip[i][j] += AMT;
    }
    if (shipsLeft.contains(4)) {
      fourShip[i][j] += AMT;
    }
    if (shipsLeft.contains(3)) {
      threeShip[i][j] += AMT;
    }
    if (shipsLeft.contains(2)) {
      twoShip[i][j] += AMT;
    }
  }

  public static void countOnes(int[][] orig, int row, int col, List<Integer> shipsLeft) {
    //right
    int i = col;
    int count = 0;
    //while you are not to end of row and element is ship, keep going forward
    while (i < orig[0].length - 1 && orig[row][i] == 1) {
      count++;
      i++;
    }
    // once you find element that is not known, increase its corresponding probability
    if (orig[row][i] == 0) {
      for (int shipVal : shipsLeft) {
        if (count < shipVal) { // checks if ship is not sunk yet
          if (shipVal == 5) {
            fiveShip[row][i] += (AMT * count); //increases probability of adjacent squares
          } else if (shipVal == 4) {
            fourShip[row][i] += (AMT * count);
          } else if (shipVal == 3) {
            threeShip[row][i] += (AMT * count);
          } else if (shipVal == 2) {
            twoShip[row][i] += (AMT * count);
          }
        }
      }
    }
    //left
    i = col;
    count = 0;
    while (i > 0 && orig[row][i] == 1) {
      count++;
      i--;
    }
    if (orig[row][i] == 0) {
      for (int shipVal : shipsLeft) {
        if (count < shipVal) {
          if (shipVal == 5) {
            fiveShip[row][i] += (AMT * count);
          } else if (shipVal == 4) {
            fourShip[row][i] += (AMT * count);
          } else if (shipVal == 3) {
            threeShip[row][i] += (AMT * count);
          } else if (shipVal == 2) {
            twoShip[row][i] += (AMT * count);
          }
        }
      }
    }
    //down
    i = row;
    count = 0;
    while (i < orig.length - 1 && orig[i][col] == 1) {
      count++;
      i++;
    }
    if (orig[i][col] == 0) {
      for (int shipVal : shipsLeft) {
        if (count < shipVal) {
          if (shipVal == 5) {
            fiveShip[i][col] += (AMT * count);
          } else if (shipVal == 4) {
            fourShip[i][col] += (AMT * count);
          } else if (shipVal == 3) {
            threeShip[i][col] += (AMT * count);
          } else if (shipVal == 2) {
            twoShip[i][col] += (AMT * count);
          }
        }
      }
    }
    //up
    i = row;
    count = 0;
    while (i > 0 && orig[i][col] == 1) {
      count++;
      i--;
    }
    if (orig[i][col] == 0) {
      for (int shipVal : shipsLeft) {
        if (count < shipVal) {
          if (shipVal == 5) {
            fiveShip[i][col] += (AMT * count);
          } else if (shipVal == 4) {
            fourShip[i][col] += (AMT * count);
          } else if (shipVal == 3) {
            threeShip[i][col] += (AMT * count);
          } else if (shipVal == 2) {
            twoShip[i][col] += (AMT * count);
          }
        }
      }
    }
  }

  public static void populateArray(int[][] orig, List<Integer> shipsLeft) {
    createProbArrays(shipsLeft);
    for (int i = 0; i < orig.length; i++) {
      for (int j = 0; j < orig[0].length; j++) {
        int shipThere = orig[i][j];
        if (shipThere == 0) {
          update(shipsLeft, i, j);
        } else if (shipThere == 1) {
          countOnes(orig, i, j, shipsLeft);
          countOnes(orig, i, j, shipsLeft);
          countOnes(orig, i, j, shipsLeft);
          countOnes(orig, i, j, shipsLeft);
        }
      }
    }
  }

  public static void prob(int[][] orig, List<Integer> shipsLeft) {
    //all zeros in orig originally have equal probability; the 1s, 2s, and -1s in orig have -1 probability
    populateArray(orig, shipsLeft);
    highestProbability(shipsLeft);
    if (shipsLeft.contains(5)) {
      System.out.println("The location row " + (fiveLoc[0]+1) + " and column " + (fiveLoc[1]+1) + " has highest probability for ship 5 of " + max5);
    }
    if (shipsLeft.contains(4)) {
      System.out.println("The location row " + (fourLoc[0]+1) + " and column " + (fourLoc[1]+1) + " has highest probability for ship 4 of " + max4);
    }
    if (shipsLeft.contains(3)) {
      System.out.println("The location row " + (threeLoc[0]+1) + " and column " + (threeLoc[1]+1) + " has highest probability for ship 3 of " + max3);
    }
    if (shipsLeft.contains(2)) {
      System.out.println("The location row " + (twoLoc[0]+1) + " and column " + (twoLoc[1]+1) + " has highest probability for ship 2 of " + max2);
    }
  }

  public static void highestProbability(List<Integer> shipsLeft) {
    for (int i = 0; i < SIZE; i++) {
      for (int j = 0; j < SIZE; j++) {
        if (shipsLeft.contains(5)) {
          double fiveProb = fiveShip[i][j];
          if (fiveProb > max5) {
            max5 = fiveProb;
            fiveLoc[0] = i;
            fiveLoc[1] = j;
          }
        }
        if (shipsLeft.contains(4)) {
          double fourProb = fourShip[i][j];
          if (fourProb > max4) {
            max4 = fourProb;
            fourLoc[0] = i;
            fourLoc[1] = j;
          }
        }
        if (shipsLeft.contains(3)) {
          double threeProb = threeShip[i][j];
          if (threeProb > max3) {
            max3 = threeProb;
            threeLoc[0] = i;
            threeLoc[1] = j;
          }
        }
        if (shipsLeft.contains(2)) {
          double twoProb = twoShip[i][j];
          if (twoProb > max2) {
            max2 = twoProb;
            twoLoc[0] = i;
            twoLoc[1] = j;
          }
        }
      }
    }
  }
}