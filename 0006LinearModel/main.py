import tensorflow as tf
import numpy as np
import matplotlib.pyplot as plt

num_count = 1000
train_data_x = np.random.rand(num_count)
train_data_y = train_data_x * 0.1 + 0.2 + np.random.randn(num_count) / 100

plt.plot(train_data_x, train_data_y, '.')

k = tf.Variable(1.0, dtype=tf.float64)
b = tf.Variable(1.0, dtype=tf.float64)

x = tf.placeholder(dtype=tf.float64)
y = tf.placeholder(dtype=tf.float64)

linear_model = k * x + b
loss = tf.reduce_mean(tf.square(y - linear_model))

op = tf.train.GradientDescentOptimizer(learning_rate=0.2)
train = op.minimize(loss)

sess = tf.Session()

init = tf.global_variables_initializer()
sess.run(init)

step_x = np.linspace(0, 1, 5)
for step in range(200):
    sess.run(train, feed_dict={x: train_data_x, y: train_data_y})
    step_y = sess.run(linear_model, feed_dict={x: step_x})
    plt.plot(step_x, step_y)
plt.show()

print(sess.run([k, b]))
