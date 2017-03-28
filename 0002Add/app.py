import tensorflow as tf

n1 = tf.constant(2, tf.float32)
n2 = tf.constant(3.14)

# n3 = tf.add(n1, n2)
n3 = n1 + n2

s = tf.Session()
print(s.run(n3))
