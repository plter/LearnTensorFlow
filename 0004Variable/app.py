import tensorflow as tf

W = tf.Variable([.3], tf.float32)
b = tf.Variable([-.3], tf.float32)
x = tf.placeholder(tf.float32)
linear_model = W * x + b

s = tf.Session()
init = tf.global_variables_initializer()
s.run(init)

print s.run(linear_model, {x: 3})
