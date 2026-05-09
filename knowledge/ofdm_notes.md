# OFDM Channel Estimation Notes

LS (Least Squares) estimation is a simple technique for estimating the channel response in OFDM systems.
Formula: H_est = Y / X
where Y is the received pilot signal and X is the known transmitted pilot.

In Darak Lab, we often use deep learning augmented LS channel estimation for real-time over-the-air implementation.
Challenges:
- Noise amplification in low SNR.
- Frequency selective fading.

Optimization in HLS:
- Use ap_fixed for complex divisions to save DSP resources on RFSoC.
- Pipeline the FFT and LS blocks to maintain real-time throughput.
