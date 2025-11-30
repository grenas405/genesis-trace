import { 
  BoxRenderer, 
  TableRenderer,
  ProgressBar,
  BannerRenderer,
  ConsoleStylerLogger
} from "../../mod.ts";

const logger = new ConsoleStylerLogger();

export class CS101 {
  private topics: string[] = [
    "Introduction to Programming",
    "Variables and Data Types",
    "Control Structures",
    "Functions and Methods",
    "Arrays and Lists",
    "Object-Oriented Programming Basics",
    "File I/O",
    "Debugging and Testing"
  ];

  async startCourse(): Promise<void> {
    BannerRenderer.render({
      title: "CS101: Introduction to Programming",
      subtitle: "Your First Step into Computer Science",
      width: 70,
      color: "blue"
    });

    await this.displayCourseOverview();
    await this.introduceProgrammingConcepts();
    await this.demonstrateVariables();
    await this.showControlStructures();
    await this.explainFunctions();
    await this.introduceArrays();
    await this.basicsOfOOP();
    await this.fileIOOperations();
    await this.debuggingFundamentals();
    await this.finalProject();
  }

  private async displayCourseOverview(): Promise<void> {
    const overview = [
      { Week: "1", Topic: "Introduction to Programming", KeyConcepts: "What is programming, problem-solving" },
      { Week: "2", Topic: "Variables and Data Types", KeyConcepts: "int, float, string, boolean" },
      { Week: "3", Topic: "Control Structures", KeyConcepts: "if/else, loops, switch" },
      { Week: "4", Topic: "Functions and Methods", KeyConcepts: "parameters, return values, scope" },
      { Week: "5", Topic: "Arrays and Lists", KeyConcepts: "indexing, iteration, common operations" },
      { Week: "6", Topic: "Object-Oriented Programming", KeyConcepts: "classes, objects, methods" },
      { Week: "7", Topic: "File I/O", KeyConcepts: "reading, writing, file handling" },
      { Week: "8", Topic: "Debugging and Testing", KeyConcepts: "testing strategies, debugging tools" }
    ];

    console.log("📅 Course Schedule");
    TableRenderer.render(overview);
  }

  private async introduceProgrammingConcepts(): Promise<void> {
    BoxRenderer.render("Programming is the process of writing instructions that tell a computer what to do. It's like writing a recipe that a computer can follow step by step.", {
      title: "💡 What is Programming?",
      color: "green",
      minWidth: 60
    });

    const concepts = [
      { Concept: "Algorithm", Description: "Step-by-step procedure", Example: "Recipe for baking" },
      { Concept: "Program", Description: "Set of instructions", Example: "Complete cookbook" },
      { Concept: "Syntax", Description: "Rules of the language", Example: "Grammar rules" },
      { Concept: "Logic", Description: "Reasoning and flow", Example: "Problem-solving approach" }
    ];

    console.log("🧠 Core Programming Concepts");
    TableRenderer.render(concepts);
  }

  private async demonstrateVariables(): Promise<void> {
    BannerRenderer.render({
      title: "📦 Variables and Data Types",
      subtitle: "Storing Information in Memory",
      width: 60,
      color: "magenta"
    });

    const variableTypes = [
      { DataType: "Integer", Description: "Whole numbers", Example: "age = 25", Size: "4 bytes" },
      { DataType: "Float", Description: "Decimal numbers", Example: "price = 19.99", Size: "8 bytes" },
      { DataType: "String", Description: "Text data", Example: "name = 'Alice'", Size: "variable" },
      { DataType: "Boolean", Description: "True/False", Example: "isStudent = true", Size: "1 byte" }
    ];

    console.log("🔤 Common Data Types");
    TableRenderer.render(variableTypes);

    await this.animateVariableAssignment();
  }

  private async animateVariableAssignment(): Promise<void> {
    logger.logInfo("🎬 Visualizing Variable Assignment:");
    
    const steps = [
      "Step 1: Declare variable",
      "Step 2: Assign value",
      "Step 3: Use variable",
      "Step 4: Modify value"
    ];

    for (let i = 0; i < steps.length; i++) {
      const progressBar = new ProgressBar({ total: steps.length });
      progressBar.update(i + 1);
      console.log(steps[i]);
      
      await this.delay(1000);
    }
  }

  private async showControlStructures(): Promise<void> {
    BannerRenderer.render({
      title: "🎮 Control Structures",
      subtitle: "Making Decisions and Repeating Actions",
      width: 60,
      color: "orange"
    });

    const controlTypes = [
      { Structure: "if/else", Purpose: "Decision making", Example: "if (age >= 18)" },
      { Structure: "for loop", Purpose: "Counted repetition", Example: "for (let i = 0; i < 10; i++)" },
      { Structure: "while loop", Purpose: "Conditional repetition", Example: "while (hasItems)" },
      { Structure: "switch", Purpose: "Multiple choices", Example: "switch (grade)" }
    ];

    console.log("🔄 Control Flow Structures");
    TableRenderer.render(controlTypes);

    await this.demonstrateLoopAnimation();
  }

  private async demonstrateLoopAnimation(): Promise<void> {
    logger.logInfo("🔄 Visualizing a For Loop:");
    
    for (let i = 1; i <= 5; i++) {
      const progressBar = new ProgressBar({ total: 5 });
      progressBar.update(i);
      console.log(`Iteration ${i}`);
      await this.delay(800);
    }
  }

  private async explainFunctions(): Promise<void> {
    BoxRenderer.render("Functions are reusable blocks of code that perform specific tasks. They help organize code and avoid repetition.", {
      title: "🔧 Functions and Methods",
      color: "purple",
      minWidth: 60
    });

    const functionParts = [
      { Part: "Name", Description: "Identifier for the function", Example: "calculateArea" },
      { Part: "Parameters", Description: "Input values", Example: "(width, height)" },
      { Part: "Body", Description: "Code to execute", Example: "{ return width * height; }" },
      { Part: "Return", Description: "Output value", Example: "return area" }
    ];

    console.log("🏗️ Function Anatomy");
    TableRenderer.render(functionParts);
  }

  private async introduceArrays(): Promise<void> {
    BannerRenderer.render({
      title: "📚 Arrays and Lists",
      subtitle: "Collections of Data",
      width: 60,
      color: "blue"
    });

    await this.animateArrayOperations();
  }

  private async animateArrayOperations(): Promise<void> {
    const operations = [
      "Creating an array",
      "Adding elements",
      "Accessing elements",
      "Removing elements",
      "Iterating through array"
    ];

    for (let i = 0; i < operations.length; i++) {
      const progressBar = new ProgressBar({ total: operations.length });
      progressBar.update(i + 1);
      console.log(operations[i]);
      await this.delay(1000);
    }
  }

  private async basicsOfOOP(): Promise<void> {
    BoxRenderer.render("OOP is a programming paradigm based on 'objects' which contain data and code. The four main principles are Encapsulation, Inheritance, Polymorphism, and Abstraction.", {
      title: "🏗️ Object-Oriented Programming Basics",
      color: "green",
      minWidth: 65
    });

    const oopConcepts = [
      { Principle: "Encapsulation", Description: "Bundling data and methods", RealworldAnalogy: "A capsule with medicine" },
      { Principle: "Inheritance", Description: "Reusing code from parent", RealworldAnalogy: "Child inheriting traits" },
      { Principle: "Polymorphism", Description: "Many forms, same interface", RealworldAnalogy: "Different payment methods" },
      { Principle: "Abstraction", Description: "Hiding complexity", RealworldAnalogy: "TV remote control" }
    ];

    console.log("🎯 OOP Principles");
    TableRenderer.render(oopConcepts);
  }

  private async fileIOOperations(): Promise<void> {
    await bannerRenderer.render({
      title: "📁 File I/O Operations",
      subtitle: "Reading and Writing Files",
      width: 60,
      borderColor: "red"
    });

    const fileOps = [
      ["Operation", "Description", "Use Case"],
      ["Read", "Get data from file", "Loading configuration"],
      ["Write", "Save data to file", "Saving user data"],
      ["Append", "Add to existing file", "Logging events"],
      ["Delete", "Remove file", "Cleaning up temp files"]
    ];

    await tableRenderer.render({
      headers: fileOps[0],
      rows: fileOps.slice(1),
      title: "💾 File Operations",
      borderColor: "cyan"
    });
  }

  private async debuggingFundamentals(): Promise<void> {
    await boxRenderer.render({
      title: "🐛 Debugging and Testing",
      content: "Debugging is the process of finding and fixing errors in code. Testing ensures your code works as expected under various conditions.",
      borderColor: "red",
      width: 60
    });

    const debuggingSteps = [
      "1. Identify the problem",
      "2. Reproduce the error",
      "3. Isolate the cause",
      "4. Fix the issue",
      "5. Test the solution",
      "6. Document the fix"
    ];

    for (const step of debuggingSteps) {
      logger.info(step);
      await this.delay(500);
    }
  }

  private async finalProject(): Promise<void> {
    await bannerRenderer.render({
      title: "🎓 Final Project: Student Management System",
      subtitle: "Apply Everything You've Learned!",
      width: 70,
      borderColor: "gold"
    });

    const projectFeatures = [
      "Add new students",
      "View student list", 
      "Search for students",
      "Calculate average grades",
      "Save data to file",
      "Load data from file"
    ];

    await boxRenderer.render({
      title: "🚀 Project Features",
      content: projectFeatures.join(" • "),
      borderColor: "green",
      width: 60
    });

    await progressRenderer.render({
      title: "Course Completion",
      current: 100,
      total: 100,
      width: 50,
      color: "gold"
    });

    logger.success("🎉 CS101 Completed Successfully!");
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}