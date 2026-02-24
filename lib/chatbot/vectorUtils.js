/**
 * Utilidades para cálculos vectoriales (similaridad cosenoidal)
 */

/**
 * Calcula el producto punto entre dos vectores
 * @param {number[]} v1 - Primer vector
 * @param {number[]} v2 - Segundo vector
 * @returns {number} Producto punto
 */
function dotProduct(v1, v2) {
  if (!v1 || !v2 || v1.length !== v2.length) return 0;
  return v1.reduce((acc, val, i) => acc + val * v2[i], 0);
}

export { dotProduct };
