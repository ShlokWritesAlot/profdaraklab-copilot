#include <ap_fixed.h>

// This is an inefficient HLS design for testing
void matrix_mult_inefficient(float A[100], float B[100], float C[100]) {
    // Missing PIPELINE pragma
    for(int i = 0; i < 100; i++) {
        // Floating point usage increases DSP usage
        C[i] = A[i] * B[i];
    }
}

// Recommended HLS design
void matrix_mult_efficient(ap_fixed<16,8> A[100], ap_fixed<16,8> B[100], ap_fixed<16,8> C[100]) {
    #pragma HLS PIPELINE II=1
    for(int i = 0; i < 100; i++) {
        #pragma HLS UNROLL factor=4
        C[i] = A[i] * B[i];
    }
}
