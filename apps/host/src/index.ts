// Async boundary: Module Federation needs the host's runtime to initialize
// (so shared deps can negotiate versions) *before* we import any code that
// uses React. The dynamic import gives webpack the chance to do that.
import("./bootstrap");
