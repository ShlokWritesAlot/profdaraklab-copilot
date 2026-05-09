import numpy as np
from scipy import fftpack

def generate_iq_data(n_samples=1024, freq=10.0, fs=100.0, noise_power=0.01):
    t = np.arange(n_samples) / fs
    i = np.cos(2 * np.pi * freq * t)
    q = np.sin(2 * np.pi * freq * t)
    
    # Add noise
    i += np.random.normal(0, np.sqrt(noise_power), n_samples)
    q += np.random.normal(0, np.sqrt(noise_power), n_samples)
    
    return i.tolist(), q.tolist()

def compute_fft(i, q):
    signal = np.array(i) + 1j * np.array(q)
    spectrum = np.abs(fftpack.fft(signal))
    freqs = fftpack.fftfreq(len(signal))
    return spectrum.tolist(), freqs.tolist()

def ofdm_tx(bits, n_fft=64, n_cp=16):
    # Simplified OFDM transmitter
    # Assume bits are already QAM symbols for simplicity
    symbols = np.array(bits)
    # Pad to n_fft
    if len(symbols) < n_fft:
        symbols = np.pad(symbols, (0, n_fft - len(symbols)))
    
    time_domain = np.fft.ifft(symbols)
    # Add cyclic prefix
    cp = time_domain[-n_cp:]
    tx_signal = np.concatenate([cp, time_domain])
    
    return tx_signal.real.tolist(), tx_signal.imag.tolist()

def ls_channel_estimation(rx_signal, tx_pilots):
    # Simplified LS estimation
    # H = Y / X
    y = np.array(rx_signal)
    x = np.array(tx_pilots)
    h_est = y / x
    return h_est.real.tolist(), h_est.imag.tolist()
